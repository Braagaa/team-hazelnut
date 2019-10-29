import Conversation from "../models/Conversation";
import Message from "../models/Message";


// POST a conversation (new conversation)
module.exports.createConversation = function(req, res, next) {
    const conversation = new Conversation({
        senderId : req.user,
        recipientId : req.body.recipientId
    });
    if (!conversation.recipientId) {
        return res.status(400).json({ message: "Please select recipient"});
    } else {
        conversation.save(function(err, conversation){
            if (err) return next(err);
            res.json(conversation);
        });
    }
};


// GET list of conversations and recipient profile
module.exports.getConversations = function(req, res, next) {
    Conversation.aggregate([
        {
            $lookup: {
                from: "profiles",
                localField: "recipientId",
                foreignField: "userId",
                as: "recipient_info"
            }
        }
    ], function(err, conversations) {
        if (err) return next(err);
        res.json(conversations);
    });
};


// POST /conversation/:conversation_id/message (new message)
module.exports.createMessage = function(req, res, next) {
    const message = new Message({
        conversationId: req.body.conversationId,
        userId: req.user,
        body: req.body.body
    });
    if (message.conversationId && message.body) {
        message.save(function(err, conversation){
            if (err) return next(err);
            res.json(conversation);
        });
    } else {
        return res.status(400).json({ message: "Please enter conversationId and message"});
    }
};


// GET /conversation/:conversation_id (body list of messages sent already)
module.exports.getMessages = function(req, res, next) {
    Message.find({})
        .populate('conversationId') 
        .populate("userId")
        .exec(function(err, courses){
            if(err) return next(err);
            res.json(courses);
        });
};



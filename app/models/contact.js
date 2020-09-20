const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema ({
    the_name: {
        type: String,
        maxlength: 40,
        required: true
    },

    email_id: {
        type: String,
        lowercase: true,
        required: true
    },

    phone_no: {
        type: String,
        default:"",
        maxlength: 10
    },
    
    the_msg: {
        type: String,
        default: "",
        maxlength: 500,
        required: true
    }
}, { timestamps: true });

mongoose.model("Contact", contactSchema);
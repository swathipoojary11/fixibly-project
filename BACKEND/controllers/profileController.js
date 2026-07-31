const supabase = require("../config/supabase");


// GET USER PROFILE
const getProfile = async (req, res) => {

    try {

        const userId = req.user.user_id;


        const { data, error } = await supabase
            .from("users")
            .select(`
                user_id,
                full_name,
                email,
                phone,
                address,
                role_id,
                created_at,
                updated_at
            `)
            .eq("user_id", userId)
            .single();


        if(error){
            return res.status(404).json({
                success:false,
                message:"Profile not found"
            });
        }


        res.status(200).json({
            success:true,
            profile:data
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message
        });

    }

};



// UPDATE USER PROFILE
const updateProfile = async (req,res)=>{

    try{

        const userId = req.user.user_id;

        const {
            full_name,
            phone,
            address
        } = req.body;


        const {data,error}= await supabase
            .from("users")
            .update({
                full_name,
                phone,
                address,
                updated_at:new Date()
            })
            .eq("user_id",userId)
            .select()
            .single();



        if(error){

            return res.status(400).json({
                success:false,
                message:error.message
            });

        }


        res.status(200).json({

            success:true,
            message:"Profile updated successfully",
            profile:data

        });



    }catch(error){

        res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message
        });

    }

};


module.exports={
    getProfile,
    updateProfile
};
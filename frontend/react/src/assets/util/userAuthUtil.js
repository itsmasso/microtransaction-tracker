export const checkAuth = async () =>{
    try{
        const response = await fetch("http://localhost:5000/user/")

    }catch(err){
        throw new Error("Not Authenticated");
    }


};
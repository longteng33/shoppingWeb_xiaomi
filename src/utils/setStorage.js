const setStorage=(type,name,data)=>{
    type=type.toUpperCase();
    if(type=='GET'){
        return JSON.parse(localStorage.getItem(name))
    }else if(type=='SET'){
        localStorage.setItem(name,JSON.stringify(data));
    }
    
}

export default setStorage;
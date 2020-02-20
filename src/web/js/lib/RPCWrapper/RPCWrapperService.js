'use strict';
class RPCWrapperService {
    constructor(){

    }
    
    /**
     * 
     * @param {string} userhash sha256 hex string
     * @param {string} passhare sha256 hex string
     */
    async create_user(userhash, passhare) {
        return theRpcClient.call("create_user", [userhash, passhare])
    }
    
    /**
     * 
     * @param {string} userhash sha256 hex string
     * @param {string} passhare sha256 hex string
     */
    async login(userhash, passhare) {
        return theRpcClient.call("login",[userhash, passhare]);
    }

    async upload_file(encryptedName, encryptedContent, isNew){
        return theRpcClient.call("upload_file",[encryptedName, encryptedContent, isNew]);
    }

    async download_file(encryptedName) {
        return theRpcClient.call("download_file",[encryptedName]);
    }

    async list_dir() {
        return theRpcClient.call("list_dir");
    }
    
    /**
     * 
     * @param {string} old_name bytes hex string
     * @param {string} new_name bytes hex string
     */
    //TODO: never tested
    async rename_file(old_name, new_name){
        return theRpcClient.call("rename_file", [old_name, new_name]);
    }

    /**
     * 
     * @param {string} file_name bytes hex string
     */
    async del_file(file_name){
        return theRpcClient.call("del_file", [file_name]);
    }
    
    
    //TODO: never tested
    async change_password(old_user_hash, old_password_hash, new_user_hash, new_password_hash, files) {
        return theRpcClient.call("change_password", [old_user_hash, old_password_hash, new_user_hash, new_password_hash, files]);
    }

    // test functions
    async ping() {
        return theRpcClient.call("ping");
    }
    
    async replay(message) {
        return theRpcClient.call("message", [message]);
    }
    
    async add(x, y) {
        return theRpcClient.call("add",[x,y]);
    }
}
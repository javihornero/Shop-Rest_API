
/**
 * Returns the current date in a (mm/dd/yyyy) format
 */
export function getDate():string{
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
}
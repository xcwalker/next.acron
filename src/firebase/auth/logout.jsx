export default async function logout() {
    let result = null,
        error = null;
        
    try {
        result = await logout();
    } catch (e) {
        error = e;
    }

    return { result, error };
}
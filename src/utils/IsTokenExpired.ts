/* 
    utility to check if the token 
    is expired before proceeding to each page
*/

import { jwtDecode } from "jwt-decode";

interface JwtPayload {
	exp: number;
}

const isTokenExpired = (token: string): boolean => {
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		const currentTime = Date.now() / 1000;
		return decoded.exp < currentTime;
	} catch (error) {
		console.log("Invalid Token", error);
		return true;
	}
};
export { isTokenExpired };

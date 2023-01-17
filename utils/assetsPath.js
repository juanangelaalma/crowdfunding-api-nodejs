import publicPath from "./publicPath.js";

export default (path = '') => {
    return publicPath(`assets${path ? '/' + path : ''}`)
}

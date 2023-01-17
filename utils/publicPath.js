const PUBLIC_PATH = './public'

export default (path = '') => {
    return `${PUBLIC_PATH}${path ? '/' + path : ''}`
}
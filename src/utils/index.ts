export const convertSearchString = (value: string) => {
    const specialCharacters = [',', '<', '>', '|'];
    const addStr = '\\';
    var strArr = String(value).split('');
    const newStr = strArr
        .map((e) => {
            if (specialCharacters.includes(e)) {
                return addStr + e;
            } else return e;
        })
        .reduce((pre, currennt) => {
            return pre + currennt;
        });
    return newStr;
};
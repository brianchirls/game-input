const boolAsNum = fn => () => fn() ? 1 : 0;
export default boolAsNum;

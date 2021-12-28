const boolAsNum = (fn: () => any) =>
	() => fn() ? 1 : 0;
export default boolAsNum;

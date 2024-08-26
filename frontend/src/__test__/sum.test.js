import sum from "../TestFiles/sum"


test('sum of two numbers ', () => {

    let res = sum(10,20);
    expect(res).toBe(30);
})

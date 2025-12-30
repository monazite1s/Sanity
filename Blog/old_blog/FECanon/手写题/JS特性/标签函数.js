function getPersonInfo(one, two, three) {
    console.log(one);
    console.log(two);
    console.log(three);
}

const person = 'Lydia';
const age = 21;

getPersonInfo`${person} is ${age} years old`;


function customTag(strings, ...values) {
    console.log("静态部分：", strings);
    console.log("插值部分：", values);

    return strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
}

const result = customTag`${person} is ${age} years old`;
console.log(result); // "Lydia is 21 years old"

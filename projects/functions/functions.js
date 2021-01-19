const returnFirstArgument = (arg) => arg;
returnFirstArgument(10);

const sumWithDefaults = (arg1, arg2 = 100) => arg1 + arg2;
sumWithDefaults(10, 20);
sumWithDefaults(10);

const returnFnResult = (fn) => fn();
returnFnResult(() => 'привет');

function returnCounter(x = 0) {
  return function f() {
    return ++x;
  };
}
const f = returnCounter(10);
console.log(f()); // выведет 11
console.log(f()); // выведет 12
console.log(f()); // выведет 13

function returnArgumentsArray() {
  const result = [];
  for (let i = 0; i < arguments.length; i++) {
    result[i] = arguments[i];
  }
  return result;
}
returnArgumentsArray(1, 2, 3, 'vasya');

function sum(a, b) {
  return a + b;
}

function bindFunction(func, arg1, arg2) {
  return function newSum() {
    return func(arg1, arg2);
  };
}

const newSum = bindFunction(sum, 2, 4);
console.log(newSum());

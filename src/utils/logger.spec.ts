
import { } from '@nestjs/core';
const { error, warn, info, http, verbose,debug, silly } = require("./logger")
const  previous=process.env.NODE_ENV;
test('error test function', () => {
    process.env.NODE_ENV='Sample';
    error("test message","test service","test method");
    expect(error).toBeDefined();
    process.env.NODE_ENV=previous;
})
test('warn  test function', () => {
    process.env.NODE_ENV='Sample';
    warn ("test message","test service","test method");
    expect(warn).toBeDefined();
    process.env.NODE_ENV=previous;
})
test('info  test function', () => {
    process.env.NODE_ENV='Sample';
    info ("test message","test service","test method");
    expect(info).toBeDefined();
    process.env.NODE_ENV=previous;
})
test('http  test function', () => {
    process.env.NODE_ENV='Sample';
    http ("test message","test service","test method");
    expect(http).toBeDefined();
    process.env.NODE_ENV=previous;
})
test('verbose  test function', () => {
    process.env.NODE_ENV='Sample';
    verbose ("test message","test service","test method");
    expect(verbose).toBeDefined();
    process.env.NODE_ENV=previous;
})
test('silly  test function', () => {
    process.env.NODE_ENV='Sample';
    silly ("test message","test service","test method");
    expect(silly).toBeDefined();
    process.env.NODE_ENV=previous;
})
test('debug  test function', () => {
    process.env.NODE_ENV='Sample';
    debug ("test message","test service","test method");
    expect(debug).toBeDefined();
    process.env.NODE_ENV=previous;
})

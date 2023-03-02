```ts
let result;
try {
  result = foo();
} catch (error) {
  //...
}

//...
```

```ts
try {
  const result = foo();

  try {
    const result2 = bar();
  } catch (error) {}
} catch (error) {
  //...
}

//...
```

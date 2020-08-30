# **Style guide in GreenCity**

## _Part 1. General Formatting Rules_

1. Use only lowercase.
2. Don&#39;t use comments.
3. End every declaration with a semicolon for consistency and extensibility reasons.

_Bad practice:_
```
.test {
  display: block;
  height:100px
} 
```
_Recommended:_
```
.test {
  display: block;
  height:100px;
} 
```

4. Use shorthand properties where possible.

_Bad practice:_

```
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;
``` 
_Recommended:_
```
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```

## _Part 2. Naming_

1. Avoid using ID, use only when absolutely necessary.
2. Use meaningful or generic ID and class names.
3. Use ID and class names that are as short as possible but as long as necessary.
4. Prefer dashes over camelCasing in class names.

_Bad practice:_

```
.myClass {
  color: #333;
}

.a {
  color: #333;
}
``` 
_Recommended:_
```
.validation-error {
  color: #333;
}
```
## _Part 3. Formatting Rules_

1. Indent by 2 spaces at a time. Do not use tabs or mix tabs and spaces for indentation.

_Bad practice:_
```
.avatar {
border-radius: 50%;
  border: 2px solid white;
 background: #f1f1f1;
}
``` 
_Recommended:_
```
.avatar {
  border-radius: 50%;
  border: 2px solid white;
  background: #f1f1f1;
}
```
2. Put a space before the opening brace { in rule declarations.

_Bad practice:_
```
.not_good{
  color: #333;
}
``` 
_Recommended:_
```
.per-line {
  color: #333;
}
```

3. In properties, put a space after, but not before, the : character.

_Bad practice:_
```
.not_good {
  color :#333;
} 
```
_Recommended:_
```
.per-line {
  color: #333;
} 
```
4. Put closing braces } of rule declarations on a new line.

_Bad practice:_
```
.not_good {
  color: #333;} 
```
_Recommended:_
```
.per-line {
  color: #333;
} 
```
5. Put just one blank line between rule declarations.

_Bad practice:_
```
.not_good {
  color: #333;
 }
.avatar {
  border-radius: 50%;
}
```
_Recommended:_
```
.per-line {
  color: #333;
}

.avatar {
  border-radius: 50%;
}
```

6. When using multiple selectors in a rule declaration, give each selector its own line.

_Bad practice:_
```
.no, .nope, .not_good {
  color: #333;} 
```
_Recommended:_
```
.one,
.selector,
.per-line {
  color: #333;
} 
```
7. Remove trailing white spaces.
8. Add a new line at the end of the file.

## _Part 4. Style Rules_

1. Avoid using _!important_. It makes debugging more difficult by breaking the natural cascading in your stylesheets.

_Bad practice:_
```
color: rgba(255, 255, 255, 0) !importan
```
_Recommended:_
```
color: rgba(255, 255, 255, 0);
```

2. Omit unit specification after &quot;0&quot; values, unless required. Do not use units after 0 values unless they are required.

_Bad practice:_
```
flex:0px;
```
_Recommended:_
```
margin: 0;
```

3. Omit leading &quot;0&quot;s in values. Do not put 0s in front of values or lengths between -1 and 1.

_Bad practice:_
```
font-size: 0.8em;
```
_Recommended:_
```
font-size:.8em;
```

4. Use 3 character hexadecimal notation where possible. For color values that permit it, 3 character hexadecimal notation is shorter and more succinct.

_Bad practice:_
```
color:#eebbcc;
```
_Recommended:_
```
color:#ebc;
```

5. Use only lowercase letters in the color name.

_Bad practice:_
```
color:#EAEEF3;
```
_Recommended:_
```
color:#eaeef3;
```

6. Always add a generic font family.

_Bad practice:_
```
font-family: "Open Sans";
```
_Recommended:_
```
font-family: "Open Sans" , sans-serif;
```

7. Use double colon for pseudo-element notation.

_Bad practice:_
```
.check-mark:after {  
  content: &quot;&quot;;  
  display: none;
}
```
_Recommended:_
```
.check-mark::after {
  content: &quot;&quot;;  
  display: none;
}
```
## _Part 5. SCSS_

1. Use the .scss syntax, never the original .sass syntax.
2. Order your regular SCSS declarations logically.
3. Nested selectors, if necessary, go last, and nothing goes after them. Add whitespace between your rule declarations and nested selectors, as well as between adjacent nested selectors. Apply the same guidelines as above to your nested selectors.

_Bad practice:_
```
.btn {
  background: green;
  font-weight: bold;
  .icon {
    margin-right: 10px;
  }
}
```
_Recommended:_
```
.btn {
  background: green;
  font-weight: bold;
  
  .icon {
    margin-right: 10px;
  }
}
```

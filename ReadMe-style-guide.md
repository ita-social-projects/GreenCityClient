# GreenCity Style Guide and Coding Conventions

Key Sections:

1. [General Formatting Rules](#part-1-general-formatting-rules);
2. [HTML component](#part-2-html-component);
3. [SCSS component](#part-3-scss-component);
4. [TS component](#part-4-ts-component);
5. [Services](#part-5-services);
6. [Directives](#part-6-directives);
7. [Modules](#part-7-Modules);
8. [Prettier](#part-8-Prettier);

# Part 1 General Formatting Rules

### Angular CLI

Use Angular CLI for creating new files in project. Not only that we are creating our components faster with Angular CLI, but it will reference those components into their own modules and will comply to the naming convention as well, so we don’t have to worry about it.

**Example**

```
ng g component example
```

### Naming

1. Use consistent names for all symbols.

2. Separate filenames with dots and dashes.
   Do use conventional type names including .service, .component, .pipe, .module, and .directive. Invent additional type names if you must but take care not to create too many.

3. Symbols and file names.
   Do use upper camel case for class names.
   Do match the name of the symbol to the name of the file.
   Do give the filename the conventional suffix (such as .component.ts, .directive.ts, .module.ts, .pipe.ts, or .service.ts) for a file of that type.

4. Service names.
   Do use consistent names for all services named after their feature.
   Do suffix a service class name with Service. For example, something that gets data or heroes should be called a DataService or a HeroService.

5. Component selectors.
   Do use dashed-case or kebab-case for naming the element selectors of components.

6. Directive selectors.
   Do Use lower camel case for naming the selectors of directives.

7. Directive custom prefix.
   Do use a custom prefix for the selector of directives (e.g, the prefix toh from Tour of Heroes).

8. Pipe names.
   Do use consistent names for all pipes, named after their feature.

9. Unit test file names.
   Do name test specification files the same as the component they test.
   Do name test specification files with a suffix of .spec.

10. End-to-End (E2E) test file names.
    Do name end-to-end test specification files after the feature they test with a suffix of .e2e-spec.

11. Angular NgModule names.
    Do append the symbol name with the suffix Module.
    Do give the filename the .module.ts extension.
    Do name the module after the feature and folder it resides in.
    Do suffix a RoutingModule class name with RoutingModule.
    Do end the filename of a RoutingModule with -routing.module.ts.

### Application structure

1. All files should reside in the folders named by the feature they represent.

2. Do make locating code intuitive, simple, and fast.

3. Do keep a flat folder structure as long as possible.

### Angular Coding Practices

1. _Single Responsibility Principle._
   It is very important not to create more than one component, service, directive… inside a single file. Every file should be responsible for a single functionality.

2. _Using Interfaces._
   If we want to create a contract for our class we should always use interfaces. By using them we can force the class to implement functions and properties declared inside the interface.
   We shouldn’t name our interfaces with the starting capital letter.We can specify optional properties, by using the question mark (?) inside an interface as well. We don’t need to populate those properties inside an object:

**Example**

```
export interface User {
    name: string;
    age: number;
    address?: string;
}
```

3. _Do be DRY (Don't Repeat Yourself)._

4. _Use ES6 Features_

5. _Using Immutability._
   Objects and arrays are the reference types in javascript. If we want to copy them into another object or an array and to modify them, the best practice is to do that in an immutable way.

6. _Small reusable components_
   Extract the pieces that can be reused in a component and make it a new one. Make the component as dumb as possible, as this will make it work in more scenarios.

7. _Create all functions small and clean._ Small functions are easier to test and reuse. Furthermore, it is much easier to understand and maintain functions with fewer lines of codes. Long methods generally indicate that they are doing too many things. Try to use the Single Responsibility Principle.

8. _Constructor Usage_ We should use the constructor method to set up Dependency Injection for our services and that is pretty much it. We shouldn’t be doing any work inside it, especially fetching the data from the server. For this type of actions, we have the lifecycle hooks in Angular.

### Formating

1. Prefer single quotes (`'`) unless escaping.

2. When you can't use double quotes, try using back ticks (\`).

3. Use `2` spaces. Not tabs.

4. Use semicolons.

5. Max line length is 140 symbols.

6. Use `camelCase` for variable and function names

**Bad practice:**

```ts
var FooVar
function BarFunc() {}
```

**Recomended**

```ts
const fooVar
function barFunc() {}
```

7. Use `PascalCase` for class names.

**Bad practice:**

```ts
class foo {}
```

**Recomended**

```ts
class Foo {}
```

8. Use `camelCase` of class members and methods

**Bad practice:**

```ts
class Foo {
  Bar: number
  Baz() {}
}
```

**Recomended**

```ts
class Foo {
  bar: number
  baz() {}
}
```

9. Always add type of variebles and methods.

10. Always leave one empty line between imports and module such as third party and application imports and third-party module and custom module.

11. Always leave one empty line at the end of files.

12. Imports
    Add the imports in the following order:

- Angular imports always go at the top;
- Rx imports;
- Third parties (non-core);
- Local/Project imports at the end;

13. Annotate arrays as `foos: Foo[]` instead of `foos: Array<Foo>`.

14. Avoid any type.

15. Avoid having subscriptions inside subscriptions.

16. Add all methods in logical order. The first methods used in the initialization of the component or main, after the methods called inside the previous methods.

**Bad practice:**

```
ngOnInit() {
   this.activate();
 }

 private show() {
   this.toastElement.style.opacity = 1;
   this.hide();
 }


 activate(message = this.defaults.message, title = this.defaults.title) {
   this.title = title;
   this.message = message;
   this.show();
 }

  private hide() {
   this.toastElement.style.opacity = 0;
   window.setTimeout(() => this.toastElement.style.zIndex = 0, 400);
 }

```

17. Add all images in folder: assets/img/module_name/unit_name. All photos must be saved structured.

**Recomended**

```
 ngOnInit() {
    this.activate();
  }

  private activate(message = this.defaults.message, title = this.defaults.title) {
    this.title = title;
    this.message = message;
    this.show();
  }

  private show() {
    this.toastElement.style.opacity = 1;
    this.hide();
  }

  private hide() {
    this.toastElement.style.opacity = 0;
    window.setTimeout(() => this.toastElement.style.zIndex = 0, 400);
  }
```

# Part 2 HTML component

1. Avoid logic in templates. All template logic will be extracted into a component. Which helps to cover that case in a unit test and reduce bugs when there is template change.

1. Indent by 2 spaces at a time. Don’t use tabs or mix tabs and spaces for indentation.

1. Use only lowercase.

1. Remove trailing white spaces. Trailing white spaces are unnecessary and can complicate diffs.

**Bad practice:**

```
<p>What?_</p>
```

**Recomended**

```
<p>Yes please.</p>
```

4. Using HTML according to its purpose is important for accessibility, reuse, and code efficiency reasons. Use elements (sometimes incorrectly called “tags”) for what they have been created for. For example, use heading elements for headings, p elements for paragraphs, a elements for anchors, etc.

**Bad practice:**

```
<div onclick="goToRecommendations();">All recommendations</div>
```

**Recomended**

```
<a href="recommendations/">All recommendations</a>
```

5. Provide alternative contents for multimedia.

```
<img src="spreadsheet.png"
     alt="Spreadsheet screenshot.">
```

6. Use a new line for every block, list, or table element, and indent every such child element.

```
<table>
  <thead>
    <tr>
      <th scope="col">Income</th>
      <th scope="col">Taxes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$ 5.00</td>
      <td>$ 4.50</td>
    </tr>
  </tbody>
</table>
```

7. When an element has two or more attributes, I normally only write one attribute per line.

8. Attributes have to be written in a specific order:

- Structural directives
- Animations
- Static properties
- Dynamic properties
- Events

**Bad practice:**

```
<input (input)="inputChanged($event)"
        *ngIf="canEdit"
        class="form-control"
        type="text"
        [placeholder]="placeholder"
        @fadeIn>
```

**Recomended**

```
<input *ngIf="canEdit"
       @fadeIn
       class="form-control"
       type="text"
       [placeholder]="placeholder"
       (input)="inputChanged($event)">
```

# Part 3 SCSS component

### _General Rules_

1. Use only lowercase.
2. Don&#39;t use comments.
3. End every declaration with a semicolon for consistency and extensibility reasons.

**Bad practice:**

```
.test {
  display: block;
  height:100px
}
```

**Recommended:**

```
.test {
  display: block;
  height:100px;
}
```

4. Use shorthand properties where possible.

**Bad practice:**

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

**Recommended:**

```
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```

### _Naming_

1. Avoid using ID, use only when absolutely necessary.
2. Use meaningful or generic ID and class names.
3. Use ID and class names that are as short as possible but as long as necessary.
4. Prefer dashes over camelCasing in class names.

**Bad practice:**

```
.myClass {
  color: #333;
}

.a {
  color: #333;
}
```

**Recommended:**

```
.validation-error {
  color: #333;
}
```

### _Formatting Rules_

1. Indent by 2 spaces at a time. Do not use tabs or mix tabs and spaces for indentation.

**Bad practice:**

```
.avatar {
border-radius: 50%;
  border: 2px solid white;
 background: #f1f1f1;
}
```

**Recommended:**

```
.avatar {
  border-radius: 50%;
  border: 2px solid white;
  background: #f1f1f1;
}
```

2. Put a space before the opening brace { in rule declarations.

**Bad practice:**

```
.not_good{
  color: #333;
}
```

**Recommended:**

```
.per-line {
  color: #333;
}
```

3. In properties, put a space after, but not before, the : character.

**Bad practice:**

```
.not_good {
  color :#333;
}
```

**Recommended:**

```
.per-line {
  color: #333;
}
```

4. Put closing braces } of rule declarations on a new line.

**Bad practice:**

```
.not_good {
  color: #333;}
```

**Recommended:**

```
.per-line {
  color: #333;
}
```

5. Put just one blank line between rule declarations.

**Bad practice:**

```
.not_good {
  color: #333;
 }
.avatar {
  border-radius: 50%;
}
```

**Recommended:**

```
.per-line {
  color: #333;
}

.avatar {
  border-radius: 50%;
}
```

6. When using multiple selectors in a rule declaration, give each selector its own line.

**Bad practice:**

```
.no, .nope, .not_good {
  color: #333;}
```

**Recommended:**

```
.one,
.selector,
.per-line {
  color: #333;
}
```

7. Remove trailing white spaces.

8. Add a new line at the end of the file.

### _Style Rules_

1. Avoid using _!important_. It makes debugging more difficult by breaking the natural cascading in your stylesheets.

**Bad practice:**

```
color: rgba(255, 255, 255, 0) !importan
```

**Recommended:**

```
color: rgba(255, 255, 255, 0);
```

2. Omit unit specification after &quot;0&quot; values, unless required. Do not use units after 0 values unless they are required.

**Bad practice:**

```
flex:0px;
```

**Recommended:**

```
margin: 0;
```

3. Omit leading &quot;0&quot;s in values. Do not put 0s in front of values or lengths between -1 and 1.

**Bad practice:**

```
font-size: 0.8em;
```

**Recommended:**

```
font-size:.8em;
```

4. Use 3 character hexadecimal notation where possible. For color values that permit it, 3 character hexadecimal notation is shorter and more succinct.

**Bad practice:**

```
color:#eebbcc;
```

**Recommended:**

```
color:#ebc;
```

5. Use only lowercase letters in the color name.

**Bad practice:**

```
color:#EAEEF3;
```

**Recommended:**

```
color:#eaeef3;
```

6. Always add a generic font family.

**Bad practice:**

```
font-family: "Open Sans";
```

**Recommended:**

```
font-family: "Open Sans" , sans-serif;
```

7. Use double colon for pseudo-element notation.

**Bad practice:**

```
.check-mark:after {
  content: &quot;&quot;;
  display: none;
}
```

**Recommended:**

```
.check-mark::after {
  content: &quot;&quot;;
  display: none;
}
```

### _SCSS_

1. Use the .scss syntax, never the original .sass syntax.
2. Order your regular SCSS declarations logically.
3. Nested selectors, if necessary, go last, and nothing goes after them. Add whitespace between your rule declarations and nested selectors, as well as between adjacent nested selectors. Apply the same guidelines as above to your nested selectors.

**Bad practice:**

```
.btn {
  background: green;
  font-weight: bold;
  .icon {
    margin-right: 10px;
  }
}
```

**Recommended:**

```
.btn {
  background: green;
  font-weight: bold;

  .icon {
    margin-right: 10px;
  }
}
```

# Part 4 TS component

1. Component structure:

- all imports
- decorator
- class

2. Consider giving components an element selector, as opposed to attribute or class selectors.

**Bad practice:**

```
@Component({
  selector: '[tohHeroButton]',
  templateUrl: './hero-button.component.html'
})
```

**Recomended**

```
@Component({
  selector: 'toh-hero-button',
  templateUrl: './hero-button.component.html'
})
```

3. Extract templates and styles to their own files.
   Do name the template file [component-name].component.html, where [component-name] is the component name.
   Do name the style file [component-name].component.css, where [component-name] is the component name.

4. In the middle of the class, the elements should be arranged in the following order:

1) public variables;
2) private variables;
3) constructor;
4) hook methods;
5) public methods;
6) private methods;

5. Add all hook methods in the order they execute. Admittedly though, this is a bit harder to follow consistently, so I guess it’s the least important one.

6. Do implement the lifecycle hook interfaces.

7. Use ngOnInit for all the initialization/declaration and avoid stuff to work in the constructor. The constructor should only be used to initialize class members and to setup Dependency Injection.

**Bad practice:**

```
export class ToastComponent implements OnInit {

  private defaults = {
    title: '',
    message: 'May the Force be with you'
  };
  message: string;
  title: string;
  private toastElement: any;

  ngOnInit() {
    this.toastElement = document.getElementById('toh-toast');
  }

  // private methods
  private hide() {
    this.toastElement.style.opacity = 0;
    window.setTimeout(() => this.toastElement.style.zIndex = 0, 400);
  }

  activate(message = this.defaults.message, title = this.defaults.title) {
    this.title = title;
    this.message = message;
    this.show();
  }

  private show() {
    console.log(this.message);
    this.toastElement.style.opacity = 1;
    this.toastElement.style.zIndex = 9999;

    window.setTimeout(() => this.hide(), 2500);
  }
}
```

**Recomended**

```
export class ToastComponent implements OnInit {
  // public properties
  message: string;
  title: string;

  // private fields
  private defaults = {
    title: '',
    message: 'May the Force be with you'
  };
  private toastElement: any;

  // public methods
  activate(message = this.defaults.message, title = this.defaults.title) {
    this.title = title;
    this.message = message;
    this.show();
  }

  ngOnInit() {
    this.toastElement = document.getElementById('toh-toast');
  }

  // private methods
  private hide() {
    this.toastElement.style.opacity = 0;
    window.setTimeout(() => this.toastElement.style.zIndex = 0, 400);
  }

  private show() {
    console.log(this.message);
    this.toastElement.style.opacity = 1;
    this.toastElement.style.zIndex = 9999;
    window.setTimeout(() => this.hide(), 2500);
  }
}
```

8. Do use the @Input() and @Output() class decorators instead of the inputs and outputs properties of the @Directive and @Component metadata:
   Consider placing @Input() or @Output() on the same line as the property it decorates.

**Bad practice:**

```
@Component({
  selector: 'toh-hero-button',
  template: `<button></button>`,
  inputs: [
    'label'
  ],
  outputs: [
    'heroChange'
  ]
})
export class HeroButtonComponent {
  heroChange = new EventEmitter<any>();
  label: string;
}
```

**Recomended**

```
@Component({
  selector: 'toh-hero-button',
  template: `<button>{{label}}</button>`
})
export class HeroButtonComponent {
  @Output() heroChange = new EventEmitter<any>();
  @Input() label: string;
}
```

9. Avoid input and output aliases except when it serves an important purpose.

**Bad practice:**

```
@Output('heroChangeEvent') heroChange = new EventEmitter<any>();
@Input('labelAttribute') label: string;
```

**Recomended**

```
@Output() heroChange = new EventEmitter<any>();
@Input() label: string;
```

10. Do limit logic in a component to only that required for the view. All other logic should be delegated to services.

11.Do name events without the prefix on.

**Bad practice:**

```
@Output() onSavedTheDay = new EventEmitter<boolean>();
```

**Recomended**

```
@Output() savedTheDay = new EventEmitter<boolean>();
```

12. Do put presentation logic in the component class, and not in the template.

13. Do not use $ to prepend your own object properties and service identifiers.

# Part 5 Services

1. Do use services as singletons within the same injector. Use them for sharing data and functionality.

2. Do create services with a single responsibility that is encapsulated by its context.
   Do create a new service once the service begins to exceed that singular purpose.

3. Do provide a service with the app root injector in the @Injectable decorator of the service.

4. Do use the @Injectable() class decorator instead of the @Inject parameter decorator when using types as tokens for the dependencies of a service.

**Bad practice:**

```
export class HeroArena {
  constructor(
      @Inject(HeroService) private heroService: HeroService,
      @Inject(HttpClient) private http: HttpClient) {}
}
```

**Recomended**

```
@Injectable()
export class HeroArena {
  constructor(
    private heroService: HeroService,
    private http: HttpClient) {}
}
```

# Part 6 Directives

1. Do use attribute directives when you have presentation logic without a template.

2. Prefer the @HostListener and @HostBinding to the host property of the @Directive and @Component decorators.

# Part 7 Modules

1. Split application into multi-modules. There are a lot of advantages to this approach. The project structure is better organized, it is more maintainable, readable and reusable and we are able to use the lazy-loading feature.

2. Use a separate routing module for the router:

```
const appRoutes: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: '404', component: NotFoundComponent }
]
```

3. Implementing a lazy loading feature is recommended. The great advantage of a lazy loading approach is that we can load our resources on demand and not all at once. This helps us in decreasing the startup time. Modules that we are loading in a lazy manner will be loaded as soon as a user navigates to their routes.

```
const appRoutes: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'owner', loadChildren: "./owner/owner.module#OwnerModule" },
]
```

4. Use Index.ts
   index.ts helps us to keep all related things together so that we don’t have to be bothered about the source file name. This helps reduce size of the import statement.

# Part 8 Prettier

1. Use npx prettier --write . to format the whole project

2. Or you can use prettier --write src/app to format only the app folder or specific folder

3. Run prettier --check . in CI to make sure that your project stays formatted.

4. On save formatting is enabled by default. You can change it at `.prettierrc.json ` config file on the line: `"editor.formatOnSave": true/false`

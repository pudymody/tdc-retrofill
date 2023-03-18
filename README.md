This is a custom element to polyfill the Microsoft ActiveX TDC object.

You can read more about it in my blog posts

How i got into this: [https://pudymody.netlify.app/blog/2023-02-04-xfiles-game-web-standards/](https://pudymody.netlify.app/blog/2023-02-04-xfiles-game-web-standards/)

How i wrote this: [https://pudymody.netlify.app/blog/2023-03-17-retrofill-microsoft-activex/](https://pudymody.netlify.app/blog/2023-03-17-retrofill-microsoft-activex/)

If you want to build it yourself, you need node and then run from the root:

```
npm run build
```

Then in the dist folder you will have a tdc.js file that you could use like this.

```html
<script type="module">
import TDC from "./tdc.js";
customElements.define("poly-tdc", TDC);
</script>
```

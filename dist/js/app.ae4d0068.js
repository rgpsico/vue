(function(t){function e(e){for(var r,n,i=e[0],c=e[1],l=e[2],u=0,d=[];u<i.length;u++)n=i[u],Object.prototype.hasOwnProperty.call(o,n)&&o[n]&&d.push(o[n][0]),o[n]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(t[r]=c[r]);m&&m(e);while(d.length)d.shift()();return s.push.apply(s,l||[]),a()}function a(){for(var t,e=0;e<s.length;e++){for(var a=s[e],r=!0,n=1;n<a.length;n++){var i=a[n];0!==o[i]&&(r=!1)}r&&(s.splice(e--,1),t=c(c.s=a[0]))}return t}var r={},n={app:0},o={app:0},s=[];function i(t){return c.p+"js/"+({}[t]||t)+"."+{"chunk-d0f1e0c0":"470e6ac9"}[t]+".js"}function c(e){if(r[e])return r[e].exports;var a=r[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,c),a.l=!0,a.exports}c.e=function(t){var e=[],a={"chunk-d0f1e0c0":1};n[t]?e.push(n[t]):0!==n[t]&&a[t]&&e.push(n[t]=new Promise((function(e,a){for(var r="css/"+({}[t]||t)+"."+{"chunk-d0f1e0c0":"e93b3738"}[t]+".css",o=c.p+r,s=document.getElementsByTagName("link"),i=0;i<s.length;i++){var l=s[i],u=l.getAttribute("data-href")||l.getAttribute("href");if("stylesheet"===l.rel&&(u===r||u===o))return e()}var d=document.getElementsByTagName("style");for(i=0;i<d.length;i++){l=d[i],u=l.getAttribute("data-href");if(u===r||u===o)return e()}var m=document.createElement("link");m.rel="stylesheet",m.type="text/css",m.onload=e,m.onerror=function(e){var r=e&&e.target&&e.target.src||o,s=new Error("Loading CSS chunk "+t+" failed.\n("+r+")");s.code="CSS_CHUNK_LOAD_FAILED",s.request=r,delete n[t],m.parentNode.removeChild(m),a(s)},m.href=o;var p=document.getElementsByTagName("head")[0];p.appendChild(m)})).then((function(){n[t]=0})));var r=o[t];if(0!==r)if(r)e.push(r[2]);else{var s=new Promise((function(e,a){r=o[t]=[e,a]}));e.push(r[2]=s);var l,u=document.createElement("script");u.charset="utf-8",u.timeout=120,c.nc&&u.setAttribute("nonce",c.nc),u.src=i(t);var d=new Error;l=function(e){u.onerror=u.onload=null,clearTimeout(m);var a=o[t];if(0!==a){if(a){var r=e&&("load"===e.type?"missing":e.type),n=e&&e.target&&e.target.src;d.message="Loading chunk "+t+" failed.\n("+r+": "+n+")",d.name="ChunkLoadError",d.type=r,d.request=n,a[1](d)}o[t]=void 0}};var m=setTimeout((function(){l({type:"timeout",target:u})}),12e4);u.onerror=u.onload=l,document.head.appendChild(u)}return Promise.all(e)},c.m=t,c.c=r,c.d=function(t,e,a){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(c.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)c.d(a,r,function(e){return t[e]}.bind(null,r));return a},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/",c.oe=function(t){throw console.error(t),t};var l=window["webpackJsonp"]=window["webpackJsonp"]||[],u=l.push.bind(l);l.push=e,l=l.slice();for(var d=0;d<l.length;d++)e(l[d]);var m=u;s.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"0567":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("preloader-component"),a("header-component"),a("div",{staticClass:"container container-body"},[a("router-view")],1),a("footer-component")],1)},n=[],o=(a("ab8b"),function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("header",[r("nav",{staticClass:"navbar navbar-expand-lg navbar-dark fixed-top bg-vuefood"},[r("div",{staticClass:"container"},[r("router-link",{staticClass:"navbar-brand",attrs:{to:{name:"home"}}},[r("img",{staticClass:"logo",attrs:{src:a("d82a"),alt:"VueFood"}})]),r("div",[r("ul",{staticClass:"navbar-nav ml-auto"},[r("li",{staticClass:"nav-item nav-cart active"},[r("router-link",{staticClass:"nav-link",attrs:{to:{name:"cart"}}},[r("i",{staticClass:"fas fa-shopping-cart"},[t._v("("+t._s(t.productsCart.length)+")")])])],1),r("li",{staticClass:"nav-item"},[t.me.name?r("router-link",{staticClass:"nav-link",attrs:{to:{name:"my.orders"}}},[t._v(" Olá "+t._s(t.me.name)+" ("),r("span",{on:{click:function(e){return e.preventDefault(),t.logout.apply(null,arguments)}}},[t._v("Sair")]),t._v(") ")]):r("router-link",{staticClass:"nav-link",attrs:{to:{name:"login"}}},[t._v("Entrar")])],1)])])],1)])])}),s=[],i=a("5530"),c=a("2f62"),l={computed:Object(i["a"])({},Object(c["d"])({productsCart:function(t){return t.cart.products},me:function(t){return t.auth.me}})),methods:Object(i["a"])({},Object(c["b"])(["logout"]))},u=l,d=a("2877"),m=Object(d["a"])(u,o,s,!1,null,null,null),p=m.exports,f=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},v=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("footer",{staticClass:"py-3 bg-vuefood"},[a("div",{staticClass:"container"},[a("p",{staticClass:"m-0 text-center text-white"},[t._v("Copyright © VueFood 2020")])])])}],h={},_=Object(d["a"])(h,f,v,!1,null,null,null),g=_.exports,C=a("bc13"),y=a("80ab"),b=a("2a1a"),E=a("1de5"),O={components:{HeaderComponent:p,HomeComponent:C["a"],FooterComponent:g,LoginComponent:y["a"],RegisterComponent:b["a"],PreLoader:E["default"]}},T=O,P=(a("1a75"),Object(d["a"])(T,r,n,!1,null,"b55b2ede",null));e["default"]=P.exports},"1a75":function(t,e,a){"use strict";a("9104")},"1de5":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.preloader?r("div",{staticClass:"preloader"},[r("img",{attrs:{src:a("3a92"),alt:"Carregando..."}}),r("p",[t._v(" "+t._s(t.textPreloader))])]):t._e()},n=[],o=a("5530"),s=a("2f62"),i={computed:Object(o["a"])({},Object(s["d"])({preloader:function(t){return t.preloader},textPreloader:function(t){return t.textPreloader}}))},c=i,l=a("2877"),u=Object(l["a"])(c,r,n,!1,null,null,null);e["default"]=u.exports},"2a1a":function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{staticClass:"d-flex justify-content-center h-100 my-5"},[r("div",{staticClass:"user_card"},[r("div",{staticClass:"d-flex justify-content-center"},[r("div",{staticClass:"brand_logo_container"},[r("router-link",{attrs:{to:{name:"home"}}},[r("img",{staticClass:"brand_logo",attrs:{src:a("b57f"),alt:"Logo"}})])],1)]),r("div",{staticClass:"d-flex justify-content-center form_container"},[r("form",{on:{submit:function(e){return e.preventDefault(),t.registerClient.apply(null,arguments)}}},[""!=t.errors.name?r("div",{staticClass:"text-danger"},[t._v(" "+t._s(t.errors.name[0]||"")+" ")]):t._e(),r("div",{staticClass:"input-group"},[t._m(0),r("input",{directives:[{name:"model",rawName:"v-model",value:t.formData.name,expression:"formData.name"}],class:["form-control","input_user",{"is-invalid":""!=t.errors.name}],attrs:{type:"text",name:"name",value:"",placeholder:"Nome"},domProps:{value:t.formData.name},on:{input:function(e){e.target.composing||t.$set(t.formData,"name",e.target.value)}}})]),""!=t.errors.email?r("div",{staticClass:"text-danger"},[t._v(" "+t._s(t.errors.email[0]||"")+" ")]):t._e(),r("div",{staticClass:"input-group"},[t._m(1),r("input",{directives:[{name:"model",rawName:"v-model",value:t.formData.email,expression:"formData.email"}],class:["form-control","input_user",{"is-invalid":""!=t.errors.email}],attrs:{type:"email",name:"email",value:"",placeholder:"E-mail"},domProps:{value:t.formData.email},on:{input:function(e){e.target.composing||t.$set(t.formData,"email",e.target.value)}}})]),""!=t.errors.password?r("div",{staticClass:"text-danger"},[t._v(" "+t._s(t.errors.password[0]||"")+" ")]):t._e(),r("div",{staticClass:"input-group"},[t._m(2),r("input",{directives:[{name:"model",rawName:"v-model",value:t.formData.password,expression:"formData.password"}],class:["form-control","input_user",{"is-invalid":""!=t.errors.password}],attrs:{type:"password",name:"password",placeholder:"Senha"},domProps:{value:t.formData.password},on:{input:function(e){e.target.composing||t.$set(t.formData,"password",e.target.value)}}})]),r("div",{staticClass:"d-flex justify-content-center login_container"},[r("button",{staticClass:"btn login_btn",attrs:{type:"submit",name:"button",disabled:t.loading}},[t.loading?r("span",[t._v("Cadastrando")]):r("span",[t._v("Cadastrar")])])])])]),r("div",{staticClass:"mt-4"},[r("div",{staticClass:"d-flex justify-content-center links"},[t._v(" Já tem conta?"),r("i",{staticStyle:{"margin-right":"5px"}}),r("router-link",{staticClass:"ml-2",attrs:{to:{name:"login"}}},[t._v("Login")])],1)])])])])},n=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"input-group-append"},[a("span",{staticClass:"input-group-text"},[a("i",{staticClass:"fas fa-user"})])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"input-group-append"},[a("span",{staticClass:"input-group-text"},[a("i",{staticClass:"fas fa-envelope"})])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"input-group-append"},[a("span",{staticClass:"input-group-text"},[a("i",{staticClass:"fas fa-key"})])])}],o=a("5530"),s=(a("d3b7"),a("2f62")),i={data:function(){return{loading:!1,formData:{name:"",email:"",password:""},errors:{name:"",email:"",password:""}}},methods:Object(o["a"])(Object(o["a"])({},Object(s["b"])(["register"])),{},{registerClient:function(){var t=this;this.reset(),this.loading=!0,this.register(this.formData).then((function(e){t.$vToastify.success("Cadastro realizado com successo","Parabéns"),t.$router.push({name:"login"})})).catch((function(e){var a=e.response;if(422===a.status)return t.errors=Object.assign(t.errors,a.data.errors),t.$vToastify.error("Dados inválidos , verifique novamente ","Erro"),void setTimeout((function(){return t.reset()}),4e3);t.$vToastify.error("Falha ao Registrar","Erro")})).finally((function(){return t.loading=!1}))},reset:function(){this.errors={name:"",email:"",password:""}}})},c=i,l=a("2877"),u=Object(l["a"])(c,r,n,!1,null,null,null);e["a"]=u.exports},"2aa5":function(t,e,a){"use strict";a("fda2")},"3a92":function(t,e,a){t.exports=a.p+"img/preloader.e4b6323e.gif"},"51eb":function(t,e,a){"use strict";a.r(e);var r=a("bc3a"),n=a.n(r),o=a("922e");n.a.defaults.baseURL=o["c"]},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d"),a("d3b7"),a("3ca3"),a("ddb0");var r=a("2b0e"),n=a("0567"),o=a("8c4f"),s=a("bc13"),i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("h1",{staticClass:"my-4 title-tenant text-center"},[t._v(t._s(t.company.name))]),a("div",{staticClass:"row"},[a("div",{staticClass:"list-categories "},[a("a",{class:["list-categories__item ",t.categoryInFilter("")],attrs:{href:"#"},on:{click:function(e){return e.preventDefault(),t.filterByCategory("")}}},[t._m(0),a("span",[t._v(" Todas ")])]),t._l(t.categories.data,(function(e,r){return a("a",{key:r,class:["list-categories__item ",t.categoryInFilter(e)],attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.filterByCategory(e.identify)}}},[t._m(1,!0),a("span",[t._v(" "+t._s(e.name)+" ")])])}))],2)]),a("div",{staticClass:"row my-4"},[0===t.company.products.data.length?a("div",[t._v(" nenhum produto encontrado ")]):t._e()]),a("div",{staticClass:"row my-4"},t._l(t.company.products.data,(function(e,r){return a("div",{key:r,staticClass:"col-lg-4 col-md-6 mb-4"},[a("div",{class:["card-flat","h-100",{disabled:t.productInCart(e)}]},[a("a",{attrs:{href:"#"}},[a("div",{staticClass:"card-image"},[a("img",{staticClass:"card-img-top",attrs:{src:e.image,alt:""}})])]),a("div",{staticClass:"card-body"},[a("h4",{staticClass:"card-title"},[a("a",{attrs:{href:"#"}},[t._v(t._s(e.title)+" ")])]),a("h5",[t._v("R$ "+t._s(e.price))]),a("p",{staticClass:"card-text"},[t._v(t._s(e.description))])]),a("div",{staticClass:"card-footer card-footer-custom"},[a("a",{attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.addProdCart(e)}}},[t._v("Adicionar no Carrinho "),a("i",{staticClass:"fas fa-cart-plus"})])])])])})),0)])},c=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"icon"},[a("i",{staticClass:"fas fa-pizza-slice"})])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"icon"},[a("i",{staticClass:"fas fa-pizza-slice"})])}],l=a("5530"),u=(a("b0c0"),a("d81d"),a("2f62")),d={props:["companyFlag"],created:function(){var t=this;if(""===this.company.name)return this.$router.push({name:"home"});this.getCategoriesByCompany(this.company.uuid).catch((function(e){return t.$vToastify.error("Falha ao carregar categorias","Erro")})),this.loadProducts()},computed:Object(l["a"])({},Object(u["d"])({company:function(t){return t.companies.companySelected},categories:function(t){return t.companies.categoriesCompanySelected},productsCart:function(t){return t.cart.products}})),data:function(){return{filters:{category:""}}},methods:Object(l["a"])(Object(l["a"])(Object(l["a"])({},Object(u["b"])(["getCategoriesByCompany","getProductsByCompany"])),Object(u["c"])({addProdCart:"ADD_PRODUCT_CART",removeTableCompany:"REMOVE_TABLE_COMPANY",removeCompany:"REMOVE_COMPANY_SELECTED"})),{},{loadProducts:function(){var t=this,e={token_company:this.company.uuid};this.filters.category&&(e.categories=[this.filters.category]),this.getProductsByCompany(e).catch((function(e){return t.$vToastify.error("falha ao carregar os produtos","Erro")}))},filterByCategory:function(t){this.filters.category=t,this.loadProducts()},categoryInFilter:function(t){return t===this.filters.category?"active":""},productInCart:function(t){var e=!1;return this.productsCart.map((function(a,r){a.identify===t.identify&&(e=!0)})),e}})},m=d,p=a("2877"),f=Object(p["a"])(m,i,c,!1,null,null,null),v=f.exports,h=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container container-body"},[a("div",{staticClass:"card shopping-cart my-4 "},[a("div",{staticClass:"card-header text-light"},[a("i",{staticClass:"fa fa-shopping-cart mr-2",attrs:{"aria-hidden":"true"}}),t._v(" Carrinho de Compras "),a("router-link",{staticClass:"btn bnt-sm btn-comprando",attrs:{to:{name:"home"}}},[t._v("Continuar Comprando")]),a("div",{staticClass:"clearfix"})],1),a("div",{staticClass:"card-body"},t._l(t.products,(function(e,r){return a("div",{key:r,staticClass:"row align-items-center py-2"},[a("div",{staticClass:"col-4 text-center"},[a("div",{staticClass:"img-circle"},[a("img",{staticClass:"img-responsive",attrs:{src:e.product.image,alt:e.product.title,width:"120",height:"80"}})])]),a("div",{staticClass:"col-8 text-left"},[a("h4",{staticClass:"product-name"},[a("strong",[t._v(t._s(e.product.title))])]),a("h5",{staticClass:"h6"},[t._v(t._s(e.product.description))]),a("div",{staticClass:"d-flex py-4 justify-content-between align-items-center"},[a("div",{staticClass:"col-10 d-flex align-items-center p-0 "},[a("h6",[a("strong",[t._v("R$ "+t._s(e.product.price)+" "),a("span",{staticClass:"text-muted"},[t._v("x")])])]),a("div",{staticClass:"quantity ml-4"},[a("input",{staticClass:"plus",attrs:{type:"button",value:"+"},on:{click:function(a){return a.preventDefault(),t.incrementQty(e.product)}}}),a("input",{staticClass:"qty",attrs:{type:"number",step:"1",max:"99",min:"1",title:"Qty"},domProps:{value:e.qty}}),a("input",{staticClass:"minus",attrs:{type:"button",value:"-"},on:{click:function(a){return a.preventDefault(),t.decrementQty(e.product)}}})])]),a("div",{staticClass:"col-2 col-sm-2 col-md-2 text-right"},[a("button",{staticClass:"btn btn-outline-danger btn-xs",attrs:{type:"button"},on:{click:function(a){return a.preventDefault(),t.removeCart(e.product)}}},[a("i",{staticClass:"fa fa-trash",attrs:{"aria-hidden":"true"}})])])])])])})),0),a("hr"),a("checkout")],1)])},_=[],g=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"cart-price text-red"},[t._v(" Preço Total: "),a("b",[t._v("R$ "+t._s(t.totalCart))])]),a("div",{staticClass:"my-4"},[a("a",{staticClass:"cart-finalizar",attrs:{href:"#"},on:{click:function(e){return e.preventDefault(),t.openModalCheckout.apply(null,arguments)}}},[t._v("Finalizar")])]),a("modal",{attrs:{name:"checkout"}},[t.loading?a("div",{staticClass:"px-md-5 my-4"},[a("p",[t._v("Gerando pedido ...(Aguarde)")])]):a("div",{staticClass:"px-md-5 my-4"},[""!==t.me.name?a("div",{staticClass:"col-12"},[a("p",[a("strong",[t._v("Total de produtos: "+t._s(t.products.length))])]),a("p",[a("strong",[t._v("Preço total: "+t._s(t.totalCart))])]),a("div",{staticClass:"form-group"},[a("textarea",{directives:[{name:"model",rawName:"v-model",value:t.comment,expression:"comment"}],attrs:{name:"comment",id:"",cols:"30",rows:"2",placeholder:"Comentario"},domProps:{value:t.comment},on:{input:function(e){e.target.composing||(t.comment=e.target.value)}}})]),a("button",{staticClass:"btn btn-success",on:{click:function(e){return e.preventDefault(),t.createOrder.apply(null,arguments)}}},[t._v("Fazer Pedidos")])]):a("div",{staticClass:"row"},[a("div",{staticClass:"col-12"},[a("p",[a("strong",[t._v("Total de produtos: "+t._s(t.products.length))])]),a("p",[a("strong",[t._v("Preço total: "+t._s(t.totalCart))])]),a("div",{staticClass:"form-group"},[a("textarea",{directives:[{name:"model",rawName:"v-model",value:t.comment,expression:"comment"}],staticClass:"form-control",attrs:{name:"comment",id:"",cols:"30",rows:"2",placeholder:"Comentario"},domProps:{value:t.comment},on:{input:function(e){e.target.composing||(t.comment=e.target.value)}}})]),a("button",{staticClass:"btn btn-success btn-full",on:{click:function(e){return e.preventDefault(),t.createOrder.apply(null,arguments)}}},[t._v("Fazer Pedidos de forma anônima")])]),a("div",{staticClass:"col-6"},[a("router-link",{staticClass:"btn btn-dark btn-full",attrs:{to:{name:"login"}}},[t._v(" fazer login ")])],1)])])])],1)},C=[],y=a("2909"),b={computed:Object(l["a"])(Object(l["a"])({},Object(u["d"])({products:function(t){return t.cart.products},me:function(t){return t.auth.me},company:function(t){return t.companies.companySelected}})),{},{totalCart:function(){var t=0;return this.products.map((function(e,a){t+=e.qty*e.product.price})),t}}),data:function(){return{comment:"",loading:!1}},methods:Object(l["a"])(Object(l["a"])({},Object(u["b"])(["createOrder","createOrderAutheticated"])),{},{createOrder:function(){var t=this;this.loading=!0;var e=""===this.me.name?"createOrder":"createOrderAutheticated",a={token_company:this.company.uuid,comment:this.comment,products:Object(y["a"])(this.products)};this.$store.dispatch(e,a).then((function(e){t.$vToastify.success("Pedido realizado com sucesso","Parabéns"),t.$router.push({name:"order.detail",params:{identify:e.identify}})})).catch((function(e){t.$vToastify.success("Pedido não pode ser","Error")})).finally((function(){return t.loading=!1}))},openModalCheckout:function(){this.$modal.show("checkout")},closeModalCheckout:function(){this.$modal.hide("checkout")}})},E=b,O=Object(p["a"])(E,g,C,!1,null,null,null),T=O.exports,P={computed:Object(l["a"])({},Object(u["d"])({products:function(t){return t.cart.products}})),methods:Object(l["a"])({},Object(u["c"])({removeCart:"REMOVE_PROD_CART",incrementQty:"INCREMENT_QTY_PROD_CART",decrementQty:"DECREMENT_QTY_PROD_CART"})),components:{Checkout:T}},x=P,D=(a("d8c8"),Object(p["a"])(x,h,_,!1,null,"3c826eb3",null)),R=D.exports,j=a("80ab"),S=a("2a1a"),A=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t._m(0),a("div",{staticClass:"my-orders my-4"},[t._m(1),t._l(t.myOrders.data,(function(e,r){return a("div",{key:r,staticClass:"my-table "},[a("div",{staticClass:"text-center"},[t._v(t._s(e.identify))]),a("div",{staticClass:"text-center"},[t._v("Data: "+t._s(e.data))]),a("div",{staticClass:"text-center"},[t._v("R$: "+t._s(e.total))]),a("router-link",{staticClass:"btn btn-danger",attrs:{to:{name:"order.detail",params:{identify:e.identify}}}},[t._v("Detalhes ")])],1)}))],2)])},w=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"my-4"},[a("h1",{staticClass:"title-tenant"},[t._v("Meus Pedidos")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"my-table-header mb-4"},[a("div",{staticClass:"text-center"},[a("b",[t._v("Nª Pedido")])]),a("div",{staticClass:"text-center"},[a("b",[t._v("Data")])]),a("div",{staticClass:"text-center"},[a("b",[t._v("Valor Total")])]),a("div",{staticClass:"text-center"},[a("b",[t._v("Detalhes")])])])}],k={created:function(){var t=this;if(""===this.me.name)return this.$router.push({name:"home"});this.getMyOrders().catch((function(e){return t.$vToastify.error("Falha ao buscar os pedidos","Erro")}))},computed:Object(l["a"])({},Object(u["d"])({myOrders:function(t){return t.orders.myOrders},me:function(t){return t.auth.me}})),methods:Object(l["a"])({},Object(u["b"])(["getMyOrders"]))},$=k,L=Object(p["a"])($,A,w,!1,null,null,null),N=L.exports,M=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"row my-4 mx-0 details"},[a("div",{staticClass:"col-12 mb-2"},[a("h1",{staticClass:"title-tenant h2"},[t._v("Detalhes do Pedido "),a("strong",[t._v(t._s(t.identify))])])]),a("div",{staticClass:"col-sm-6"},[a("ul",{staticClass:"p-0"},[a("li",[a("b",[t._v("Número:")]),t._v(" "+t._s(t.identify))]),a("li",[a("b",[t._v("Total:")]),t._v(" R$ "+t._s(t.order.total))]),a("li",[a("b",[t._v("Data:")]),t._v(" "+t._s(t.order.date))]),a("li",[a("b",[t._v("Status:")]),t._v(" "),a("span",{staticClass:"badge bg-success text-light p-2"},[t._v(t._s(t.order.status))])])])]),a("div",{staticClass:"col-sm-6"},[a("ul",{staticClass:"p-0"},[a("li",[a("span",[t._v("Cliente")]),t.order.client.name?a("ul",{staticClass:"p-0"},[a("li",[a("b",[t._v("Nome:")]),t._v(" "+t._s(t.order.client.name))]),a("li",[a("b",[t._v("E-mail:")]),t._v(" "+t._s(t.order.client.email))])]):t._e()])])])]),t._v(" "),a("hr"),a("div",{staticClass:"row my-4"},[t._m(0),t._l(t.order.products,(function(e,r){return a("div",{key:r,staticClass:"col-12 col-md-6 col-lg-4 my-1"},[a("div",{staticClass:"details-card"},[a("a",{attrs:{href:""}},[a("img",{staticClass:"card-img-top",attrs:{src:e.image,alt:e.title}})]),a("div",{staticClass:"details-card-body"},[a("h5",[t._v(t._s(e.title))]),a("p",[a("b",[t._v("R$: "+t._s(e.price))])])])])])})),a("hr"),a("button",{staticClass:"btn btn-success col-md-2",on:{"v-if":function(e){""!=t.me.name&&t.me.name===t.order.client.name&&t.order.evaluation.length},click:function(e){return e.preventDefault(),t.openModalEvaluation.apply(null,arguments)}}},[t._v(" Avaliar o Pedido ")]),a("modal",{attrs:{name:"evaluation-order",heigth:350}},[a("div",{staticClass:"px-md-5 my-4"},[a("h1",[t._v("Avaliar o pedido "+t._s(t.identify))]),a("strong",[t._v("Nota:")]),a("vue-stars",{class:"",attrs:{name:"evaluation","active-color":"#ffdd00","inactive-color":"#999999","shadow-color":"#ffff00","hover-color":"#dddd00",max:5,value:3,readonly:!1,char:"★","inactive-char":""},model:{value:t.evaluation.stars,callback:function(e){t.$set(t.evaluation,"stars",e)},expression:"evaluation.stars"}}),a("div",{staticClass:"form-group"},[a("textarea",{directives:[{name:"model",rawName:"v-model",value:t.evaluation.comment,expression:"evaluation.comment"}],staticClass:"form-control",attrs:{name:"comment",id:"",cols:"30",rows:"3",placeholder:"comentário"},domProps:{value:t.evaluation.comment},on:{input:function(e){e.target.composing||t.$set(t.evaluation,"comment",e.target.value)}}})]),a("button",{staticClass:"btn btn-info my-3",attrs:{disabled:t.loadSendEvaluation},on:{click:function(e){return e.preventDefault(),t.sendEvaluation.apply(null,arguments)}}},[t.loadSendEvaluation?a("span",[t._v("Enviando...")]):a("span",[t._v("Avaliar")])])],1)]),t.order.evaluations.length?a("div",{staticClass:"evaluations-order col-12"},t._l(t.order.evaluations,(function(e,r){return a("div",{key:r},[a("p",[a("strong",[t._v("Nome:")]),t._v(" "+t._s(e.client.name))]),a("p",[a("strong",[t._v("Comentário::")]),t._v(" "+t._s(e.comment))]),a("p",[a("strong",[t._v("Nota")]),a("vue-stars",{class:"",attrs:{name:"evaluation-user","active-color":"#ffdd00","inactive-color":"#999999","shadow-color":"#ffff00","hover-color":"#dddd00",max:5,readonly:!0,char:"★","inactive-char":"",value:e.stars}})],1)])})),0):t._e()],2)])},I=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"col-12"},[a("h4",[t._v("Produtos")])])}],B={props:["identify"],computed:Object(l["a"])({},Object(u["d"])({me:function(t){return t.auth.me}})),created:function(){var t=this;this.getOrderByIdentify(this.identify).then((function(e){return t.order=Object.assign(t.order,e.data.data)})).catch((function(e){t.$vToastify.error("Falha carregar detalhes do pedido","Erro"),t.$router.push({name:"home"})}))},data:function(){return{order:{identify:"",date:"",status:"",total:"",client:{name:"",email:""},company:{name:"",image:""},products:[],evaluations:[]},evaluation:{star:1,comment:""},loadSendEvaluation:!1}},methods:Object(l["a"])(Object(l["a"])({},Object(u["b"])(["getOrderByIdentify","evaluationOrder"])),{},{openModalEvaluation:function(){this.$modal.show("evaluation-order")},closeModalEvaluation:function(){this.$modal.hide("evaluation-order")},sendEvaluation:function(){var t=this;this.loadSendEvaluation=!0;var e=Object(l["a"])({identify:this.identify},this.evaluation);this.evaluationOrder(e).then((function(e){t.$vToastify.success("Avaliação enviada com successo","Parabéns"),t.order.evaluations.push(e.data.data),t.closeModalEvaluation()})).catch((function(e){return t.$vToastify.error("Falha ao Avaliar","Erro")})).finally((function(){return t.loadSendEvaluation=!1}))}})},F=B,z=Object(p["a"])(F,M,I,!1,null,null,null),Y=z.exports,q=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},U=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"my-4 text-center"},[r("img",{attrs:{src:a("c18c"),alt:"404"}})])}],Q={},V=Q,X=(a("2aa5"),Object(p["a"])(V,q,U,!1,null,"92ea3cce",null)),G=X.exports,H=[{path:"/",component:function(){return Promise.resolve().then(a.bind(null,"0567"))},children:[{path:"/pedido/:identify",component:Y,name:"order.detail",props:!0},{path:"/meus-pedidos",component:N,name:"my.orders"},{path:"/carrinho",component:R,name:"cart"},{path:"/loja/:companyFlag",component:v,name:"products",props:!0},{path:"/",component:s["a"],name:"home"}]},{path:"/auth",component:function(){return a.e("chunk-d0f1e0c0").then(a.bind(null,"b320"))},children:[{path:"/entrar",component:j["a"],name:"login"},{path:"/cadastrar",component:S["a"],name:"register"}]},{path:"*",component:G,meta:{title:"Página não encontrada"}}],J=H;r["a"].use(o["a"]);var K=new o["a"]({routes:J,mode:"history"}),W=K,Z={preloader:!1,textPreloader:"Carregando..."},tt={SET_PRELOADER:function(t,e){t.preloader=e,t.textPreloader="Carregando..."},SET_TEXT_PRELOADER:function(t,e){t.textPreloader=e}},et={items:{data:[]},companySelected:{name:"",products:{data:[]}},categoriesCompanySelected:{data:[]}},at=et,rt={SET_COMPANIES:function(t,e){t.items=e},SET_COMPANY_SELECTED:function(t,e){t.companySelected=Object.assign(t.companySelected,e)},SET_CATEGORIES_COMPANY:function(t,e){t.categoriesCompanySelected=e},SET_PRODUCTS_COMPANY:function(t,e){t.companySelected.products=e}},nt=(a("99af"),a("bc3a")),ot=a.n(nt),st=a("922e"),it="tenants",ct={getCompanies:function(t){var e=t.commit;return e("SET_PRELOADER",!0),e("SET_TEXT_PRELOADER","Carregando os Textos"),ot.a.get("".concat(st["a"],"/").concat(it)).then((function(t){return e("SET_COMPANIES",t.data)})).finally((function(){return e("SET_PRELOADER",!1)}))},getCategoriesByCompany:function(t,e){var a=t.commit;a("SET_PRELOADER",!0),a("SET_TEXT_PRELOADER","Carregando as categorias");return ot.a.get("".concat(st["a"],"/categories"),{params:{token_company:e}}).then((function(t){return a("SET_CATEGORIES_COMPANY",t.data)})).finally((function(){return a("SET_PRELOADER",!1)}))},getProductsByCompany:function(t,e){var a=t.commit;return a("SET_PRELOADER",!0),a("SET_TEXT_PRELOADER","Carregando os produtos"),a("SET_PRODUCTS_COMPANY",{data:[]}),ot.a.get("".concat(st["a"],"/products"),{params:e}).then((function(t){return a("SET_PRODUCTS_COMPANY",t.data)})).finally((function(){return a("SET_PRELOADER",!1)}))},getTableFromCompany:function(t,e){var a=t.commit;return a("SET_PRELOADER",!0),a("SET_TEXT_PRELOADER","Carregando a mesa"),ot.a.get("".concat(st["a"],"/tables/").concat(e.table),{params:e}).then((function(t){return a("SET_TABLE_COMPANY",t.data.data)})).finally((function(){return a("SET_PRELOADER",!1)}))}},lt=a("ce06"),ut=a.n(lt),dt={state:at,mutations:rt,actions:ct,getters:ut.a},mt=(a("4de4"),{state:{products:[]},mutations:{ADD_PRODUCT_CART:function(t,e){t.products.push({qty:1,identify:e.identify,product:e})},REMOVE_PROD_CART:function(t,e){t.products=t.products.filter((function(t,a){return t.identify!==e.identify}))},INCREMENT_QTY_PROD_CART:function(t,e){t.products=t.products.map((function(a,r){return a.identify===e.identify&&t.products[r].qty++,t.product[r]}))},DECREMENT_QTY_PROD_CART:function(t,e){t.products=t.products.filter((function(a,r){if(a.identify===e.identify&&(t.products[r].qty=t.products[r].qty-1),t.products[r].qty>0)return t.products[r]}))},CLEAR_CART:function(t){t.products=[]}},actions:{},getters:{}}),pt={state:{me:{name:"",email:""},authenticated:!1},mutations:{SET_ME:function(t,e){t.me=e,t.authenticated=!0},SET_AUTHENTICATED:function(t,e){t.authenticated=e},LOGOUT:function(t){t.me={name:"",email:""},t.authenticated=!1}},actions:{register:function(t,e){t.commit;return ot.a.post("auth/register",e)},login:function(t,e){t.commit;var a=t.dispatch;return ot.a.post("auth/token",e).then((function(t){var e=t.data.token;localStorage.setItem(st["b"],e),a("getMe")}))},getMe:function(t){var e=t.commit,a=localStorage.getItem(st["b"]);if(a)return ot.a.get("auth/me",{headers:{Authorization:"Bearer ".concat(a)}}).then((function(t){return e("SET_ME",t.data.data)})).catch((function(t){return localStorage.removeItem(st["b"])}))},logout:function(t){var e=t.commit,a=localStorage.getItem(st["b"]);if(a)return ot.a.post("auth/logout",{},{headers:{Authorization:"Bearer ".concat(a)}}).then((function(t){e("LOGOUT"),console.log("deslogou"),localStorage.removeItem(st["b"])}))}}},ft={myOrders:{data:[]}},vt={SET_ORDERS:function(t,e){t.myOrders=e},SET_ORDER:function(t,e){t.myOrders.data=e}},ht={getMyOrders:function(t){var e=t.commit,a=localStorage.getItem(st["b"]);return a||Promise.reject(),e("SET_PRELOADER",!0),e("SET_TEXT_PRELOADER","Carregando os meus pedidos"),ot.a.get("auth/".concat(st["a"],"/my-orders"),{headers:{Authorization:"Bearer ".concat(a)}}).then((function(t){return e("SET_ORDERS",t.data)})).finally((function(){return e("SET_PRELOADER",!1)}))},getOrderByIdentify:function(t,e){var a=t.commit;return a("SET_PRELOADER",!0),a("SET_TEXT_PRELOADER","Carregando os detalhes do pedido"),ot.a.get("".concat(st["a"],"/orders/").concat(e)).finally((function(){return a("SET_PRELOADER",!1)}))},evaluationOrder:function(t,e){t.commit;var a=localStorage.getItem(st["b"]);return a||Promise.reject(),ot.a.post("auth/".concat(st["a"],"/orders/").concat(e.identify,"/evaluations"),e,{headers:{Authorization:"Bearer ".concat(a)}})},createOrder:function(t,e){var a=t.commit;return new Promise((function(t,r){ot.a.post("".concat(st["a"],"/orders"),e).then((function(e){a("CLEAR_CART"),t(e.data.data)})).catch((function(t){return r(t.error)}))}))},createOrderAutheticated:function(t,e){var a=t.commit;return new Promise((function(t,r){var n=localStorage.getItem(st["b"]);n||r(),ot.a.post("auth/".concat(st["a"],"/orders"),e,{headers:{Authorization:"Bearer ".concat(n)}}).then((function(e){a("CLEAR_CART"),t(e.data.data)})).catch((function(t){return r(t.error)}))}))}},_t={state:ft,mutations:vt,actions:ht};r["a"].use(u["a"]);var gt=new u["a"].Store({modules:{companies:dt,cart:mt,auth:pt,orders:_t},state:Z,mutations:tt});a("51eb"),a("6912"),r["a"].config.productionTip=!1,r["a"].component("preloader-component",(function(){return Promise.resolve().then(a.bind(null,"1de5"))})),new r["a"]({render:function(t){return t(n["default"])},router:W,store:gt}).$mount("#app"),gt.dispatch("getMe")},6912:function(t,e,a){a("7614"),a("71d6"),a("6c15")},"6c15":function(t,e,a){"use strict";a.r(e);var r=a("2b0e"),n=a("0ed0");r["a"].component("vue-stars",n["VueStars"])},"71d6":function(t,e,a){"use strict";a.r(e);var r=a("2b0e"),n=a("1881"),o=a.n(n);r["a"].use(o.a)},7614:function(t,e,a){"use strict";a.r(e);var r=a("2b0e"),n=a("6838"),o=a.n(n);r["a"].use(o.a)},"80ab":function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{staticClass:"d-flex justify-content-center h-100 my-5"},[r("div",{staticClass:"user_card"},[r("div",{staticClass:"d-flex justify-content-center"},[r("div",{staticClass:"brand_logo_container"},[r("router-link",{attrs:{to:{name:"home"}}},[r("img",{staticClass:"brand_logo",attrs:{src:a("b57f"),alt:"Logo"}})])],1)]),r("div",{staticClass:"d-flex justify-content-center form_container"},[r("form",{on:{submit:function(e){return e.preventDefault(),t.auth.apply(null,arguments)}}},[""!=t.errors.email?r("div",{staticClass:"text-danger"},[t._v(" "+t._s(t.errors.email[0]||"")+" ")]):t._e(),r("div",{staticClass:"input-group"},[t._m(0),r("input",{directives:[{name:"model",rawName:"v-model",value:t.formData.email,expression:"formData.email"}],class:["form-control","input_user",{"is-invalid":""!=t.errors.email}],attrs:{type:"email",name:"email",value:"",placeholder:"E-mail"},domProps:{value:t.formData.email},on:{input:function(e){e.target.composing||t.$set(t.formData,"email",e.target.value)}}})]),""!=t.errors.password?r("div",{staticClass:"text-danger"},[t._v(" "+t._s(t.errors.password[0]||"")+" ")]):t._e(),r("div",{staticClass:"input-group"},[t._m(1),r("input",{directives:[{name:"model",rawName:"v-model",value:t.formData.password,expression:"formData.password"}],class:["form-control","input_user",{"is-invalid":""!=t.errors.password}],attrs:{type:"password",name:"password",placeholder:"Senha"},domProps:{value:t.formData.password},on:{input:function(e){e.target.composing||t.$set(t.formData,"password",e.target.value)}}})]),r("div",{staticClass:"d-flex justify-content-center login_container"},[r("button",{staticClass:"btn login_btn",attrs:{type:"submit",name:"button",disabled:t.loading}},[t.loading?r("span",[t._v("entrando")]):r("span",[t._v("Entrar")])])])])]),r("div",{staticClass:"mt-4"},[r("div",{staticClass:"d-flex justify-content-center links"},[t._v(" Já tem conta?"),r("i",{staticStyle:{"margin-right":"5px"}}),r("router-link",{staticClass:"ml-2",attrs:{to:{name:"login"}}},[t._v("Login")])],1)])])])])},n=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"input-group-append"},[a("span",{staticClass:"input-group-text"},[a("i",{staticClass:"fas fa-envelope"})])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"input-group-append"},[a("span",{staticClass:"input-group-text"},[a("i",{staticClass:"fas fa-key"})])])}],o=a("5530"),s=(a("d3b7"),a("2f62")),i={computed:{deviceName:function(){return navigator.appCodeName+navigator.appName+navigator.platform+this.formData.email}},data:function(){return{loading:!1,formData:{email:"",password:""},errors:{email:"",password:""}}},methods:Object(o["a"])(Object(o["a"])({},Object(s["b"])(["login"])),{},{auth:function(){var t=this;this.reset(),this.loading=!0;var e=Object(o["a"])({device_name:this.deviceName},this.formData);console.log(e),this.login(e).then((function(e){t.$vToastify.success("Logado com successo","Parabéns"),t.$router.push({name:"home"})})).catch((function(e){var a=e.response;if(422===a.status)return t.errors=Object.assign(t.errors,a.data.errors),t.$vToastify.error("Dados inválidos , verifique novamente ","Erro"),void setTimeout((function(){return t.reset()}),4e3);t.$vToastify.error("Falha ao logar","Erro")})).finally((function(){return t.loading=!1}))},reset:function(){this.errors={email:"",password:""}}})},c=i,l=a("2877"),u=Object(l["a"])(c,r,n,!1,null,null,null);e["a"]=u.exports},9104:function(t,e,a){},"922e":function(t,e,a){"use strict";a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){return n})),a.d(e,"b",(function(){return o}));var r="http://127.0.0.1:8000/api",n="v1",o="token_sanctum"},"9d3d":function(t,e,a){},b57f:function(t,e,a){t.exports=a.p+"img/vue-food.2e940edb.png"},bc13:function(t,e,a){"use strict";var r=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"row"},[r("div",{staticClass:"col-lg-12"},[r("h1",{staticClass:"my-4 title-tenant"},[t._v("Restaurantes")]),r("div",{staticClass:"row my-4"},t._l(t.companies.data,(function(e,n){return r("div",{key:n,staticClass:"col-lg-2 col-md-2 col-4 mb-2"},[r("div",{staticClass:"restaurant-card"},[r("a",{attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.goStoreCompany(e)}}},[e.image?r("img",{staticClass:"card-img-top",attrs:{src:e.image,alt:e.name,height:80,width:80}}):r("img",{staticClass:"card-img-top",attrs:{src:a("b57f"),alt:e.name,height:80,width:80}})]),r("div",{staticClass:"restaurant-card-body"},[r("h3",[r("a",{attrs:{href:"#"},on:{click:function(a){return a.preventDefault(),t.goStoreCompany(e)}}},[t._v(" "+t._s(e.name)+" ")])])])])])})),0)])])},n=[],o=a("5530"),s=a("2f62"),i={mounted:function(){var t=this;this.getCompanies().catch((function(e){return t.$vToastify.error("Falha ao carregar empresas","Erro")}))},computed:Object(o["a"])({},Object(s["d"])({companies:function(t){return t.companies.items}})),methods:Object(o["a"])(Object(o["a"])(Object(o["a"])({},Object(s["b"])(["getCompanies"])),Object(s["c"])({setCompany:"SET_COMPANY_SELECTED"})),{},{goStoreCompany:function(t){this.setCompany(t),this.$router.push({name:"products",params:{companyFlag:t.flag}})}})},c=i,l=a("2877"),u=Object(l["a"])(c,r,n,!1,null,null,null);e["a"]=u.exports},c18c:function(t,e,a){t.exports=a.p+"img/404.d7165a7c.png"},ce06:function(t,e){},d82a:function(t,e,a){t.exports=a.p+"img/logo-vuefood.07caf6bb.png"},d8c8:function(t,e,a){"use strict";a("9d3d")},fda2:function(t,e,a){}});
//# sourceMappingURL=app.ae4d0068.js.map
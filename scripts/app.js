"use strict";
/* SISTEMA FEITO POR PAULAO */
/* SISTEMA KHAN */

class Khan {

    /* CONTRUTOR E JA SETA AS FUNCOES DE VERIFICACAO */
    constructor($app, status = false) {
        window["limparCacheModulos"] = function(m){
            m.map((v) => {
                 sessionStorage.removeItem(v);
                 console.log('Limpado Cache do Modulo '+ v);
            });
        };
        this.routeStatus = status;
        this.Addons();
        this.ImgLoaded();
        this.app = $app;
        this.Services = {};
        this.uriHome();
        this.ifModelBind();
        this.ifTextAnimate();
        this.Works = {};
        window.exports = {};
        window.modulesCached = {};
    }

    converteFunction(fun){
        var funncs, funnsName, funnsBody, parray = [], retorno = {};
        funnsName = Object.keys(fun).map((v) => {
            return v;
        });
        funnsBody = Object.values(fun).map((v) => {
            var indx = v.indexOf('{') + 1;
            v = v.substr(indx, v.length);
            v = v.substr(0, v.length - 1);
            v = v.replace(/  /g, '').replace(/\n/g, '');
            return v;
        });
        var params = Object.values(fun).map((v) => {
        var x = v.split('('),
            v = x[1].split(')');
            parray.push(v[0].split(','));
            funncs = v[1].split('{');
        });
        params = parray.map((v) => {
            return v.map((v) => {
              return v.replace(' ','');
            })
        });
        funnsName = funnsName.map((v, i) => {
            retorno[v] = new Function(...params[i], funnsBody[i]);
        });
        return retorno;
    }

    requireModule(module){
        var cache = (sessionStorage.getItem(module) == null) ? false : true;
        this.Work({
            name: 'Modules',
            url: 'works/KhanWorkModules.js'
        },function(Work){
            Work.postMessage(module);
            Work.onmessage = function(e){
                    var dtt = JSON.stringify(e.data);
                    if(cache){
                        sessionStorage.removeItem(module);
                        sessionStorage.setItem(module, dtt);
                    }else{
                        sessionStorage.setItem(module, dtt);
                        location.reload();
                    }
            };
        });
        cache = this.converteFunction(JSON.parse(sessionStorage.getItem(module))); 
        return cache; 
    }

    /* CARREGA AS IMAGENS ASSINCRONAMENTE */
    ImgLoaded() {
        setTimeout(() => {
            if (document.querySelectorAll('[khan-img-src]').length != 0) {
                document.querySelectorAll('[khan-img-src]').forEach((v, i) => {
                    this.Encrypt(v.getAttribute('khan-img-src')).then((va) => {
                        va = va.substr(0, va.length / 2.5);
                        v.setAttribute('hash', va);
                    });
                    v.setAttribute('khan-img-src', window.btoa(v.getAttribute('khan-img-src')));
                    v.setAttribute('class', 'khan-img-' + i);
                    if (sessionStorage.getItem('khan-img-' + i) != null) {
                        v.src = sessionStorage.getItem('khan-img-' + i);
                    } else {
                        var req = new Request(window.atob(v.getAttribute('khan-img-src')));
                        fetch(req).then(function(response) {
                            return response.blob();
                        }).then(function(myBlob) {
                            var objectURL = URL.createObjectURL(myBlob);
                            v.src = objectURL;
                            sessionStorage.setItem('khan-img-' + i, objectURL);
                        });
                    }
                });


            }
        }, 0.2);
    }

    /* GERADOR DE WORKS MACHINE */
    Work(ob, callback) {
        this.Works[ob.name] = new Worker(ob.url);
        callback(this.Works[ob.name]);
    }

    /* CONTAINERS */

    Containers(data) {
        var channel = data.channel;
        this.Work({
                name: 'Jskhan',
                url: 'works/KhanWork.js'
            },
            function(Work) {
                Work.postMessage({
                    name: data.channel,
                    fu: data.funcao.toString(),
                    action: 'setContainer'
                });
            });
        return {
            setContainer: function(data){
                data["Work"].postMessage({
                    name: data.channel,
                    fu: data.funcao.toString(),
                    action: 'setContainer'
                });
            },
            getContainer: function(data) {
                data.scope.postMessage({
                    name: data.channel,
                    action: 'getContainer'
                });
            },
            getRunService: function(data) {
                data.scope.postMessage({
                    name: data.channel,
                    action: 'getRunService'
                });
            },
            GetCanal: function() {
                return channel;
            },
            setRunService: function(data) {
                if (data.data.length == 0) {
                    data.scope.postMessage({
                        name: data.channel,
                        action: 'setRunService'
                    });
                } else {
                    data.scope.postMessage({
                        name: data.channel,
                        parame: data.data,
                        action: 'setRunService'
                    });
                }
            }
        };
    }

    /* FUNCOES EXTRAS Each e Memorize de Cache */

    Addons() {
        window["CacheModules"] = function(module){
            sessionStorage.removeItem(module);
            document.location.reload();
        },
        Object.prototype.Each = function(cb) {
            const Keys = Object.keys(this),
                Values = Object.values(this);
            cb(Values, Keys);
        };
        Function.prototype.Memorize = function() {
            const scope = this;
            let cache = new Object(),
                key;
            return (...args) => {
                key = JSON.stringify(args);
                return cache[key] || (cache[key] = scope.call(null, ...args));
            }
        };
    }

    /* CRIPTOGRAFADOR DE STRINGS */
    Encrypt(str) {

        return new Promise(function(resolve, reject) {

            var hash = CryptoJS.SHA256(str);
            const cryptado = hash.toString(CryptoJS.enc.Base64);
            resolve(cryptado);

        });

    }

    /* TEXTO ESCREVE NA TELA*/
    ifTextAnimate() {
        setTimeout(() => {

            if (document.querySelectorAll('[khan-txt-animate]').length != 0) {
                this.getTextAnimate();
            }

        }, 2000);

    }

    getTextAnimate() {

        var caixas = document.querySelectorAll('[khan-txt-animate]');

        caixas.forEach((v, i) => {
            var txt = v.innerHTML.split(''),
                t = document.createElement('p'),
                m = document.createElement('p');
            t.setAttribute('class', 'khan-txt-animate-' + i);
            m.setAttribute('class', 'khan-txt-animate-mark')
            m.innerHTML = ' |';
            v.innerHTML = '';
            v.appendChild(t);
            v.appendChild(m);
            var tAtual = document.querySelector('.khan-txt-animate-' + i);
            this.setTextAnimate(txt, tAtual);
        });

    }

    setTextAnimate(txt, tAtual) {

        txt.forEach((val, ind) => {
            setTimeout(() => {
                tAtual.innerHTML += val;
                if ((txt.length - 1) == ind) {
                    setTimeout(() => {
                        tAtual.innerHTML = '';
                        this.setTextAnimate(txt, tAtual);
                    }, 1500);
                }
            }, ind * 300);
        });

    }

    /* FUNCAO PARA PEGAR URL */
    uriHome() {

        if (location.hash.length == 0 && this.routeStatus == true) {
            location.href = '#/index';
        }

    }

    /* INPUT QUE ESCREVE EM OUTRO ELEMENTO */
    ifModelBind() {

        setTimeout(() => {
            if (document.querySelectorAll('[khan-model]').length > 0) {
                this.ModelBind();
            }
        }, 10);

    }

    ModelBind() {
        document.querySelectorAll('[khan-model]').forEach((v, i) => {
            v.onkeyup = function() {
                new Khan().ViewBind(this);
            };
        });
    }

    ViewBind($bind) {
        if (document.querySelector('[khan-view="' + $bind.getAttribute('khan-model') + '"]').nodeName == 'INPUT') {
            document.querySelector('[khan-view="' + $bind.getAttribute('khan-model') + '"]').
            value = $bind.value
        } else {
            document.querySelector('[khan-view="' + $bind.getAttribute('khan-model') + '"]').
            innerHTML = $bind.value;
        }
    }

    /* PEGA VIEW DO PROJETO */
    GetView() {
        return document.querySelector('[khan-app]').getAttribute('khan-app');
    }

    /* FETCH JSON REQUEST PROMISE */
    fetchJSON(ob) {
        return new Promise(function(resolve, reject) {

            fetch(ob.url, {
                method: ob.method // opcional
            }).then(function(response) {
                response.text().then(function(result) {
                    resolve(result);
                });
            }).catch(function(err) {
                reject("Ocorreu um erro");
            });

        });
    }

    /* REQUESTS */
    Request($page, $d, $callback = function() {}) {
        var $request = new XMLHttpRequest();
        var $posts = '';
        var $dataKeys = Object.keys($d),
            $dataValues = Object.values($d),
            $dataPostArr = '';
        $dataKeys.forEach((val, index) => {
            if ((index + 1) < $dataKeys.length) {
                $dataPostArr += val + '=' + $dataValues[index] + '&';
            } else if ((index + 1) == $dataKeys.length) {
                $dataPostArr += val + '=' + $dataValues[index];
            }
        });
        $request.onreadystatechange = () => {
            if (this.readyState == 4 && this.status == 200) {
                $callback(this.textReponse);
            }
        }
        $request.open("POST", $page, true);
        $request.send($dataPostArr);
    }

    /* SISTEM ROUTES */

    Routes($name = 'index', $callback = function() {}) {
        $name = $name.toString().split('/');
        if (this.GetUri().All()[0] == $name[1] && this.GetUri().All().length > 0) {
            $callback(this.getParameters(this.postParameters($name), $name));
        } else if (location.hash == "#/") {
            location.href = location.hash + 'index';
        }
    }

    GetUri() {
        return {
            All: () => {
                var r = (location.hash.length > 0) ? location.hash.split('/') : ['#', 'index'];
                delete r[0];
                return r.filter((val) => {
                    return val != 'undefined';
                });
            },
            Filter: ($string) => {
                $string = $string.replace(/(<([^>]+)>)/ig, "");
                $string = $string.replace(/<\/?[^>]+(>|$)/g, "");
                return $string;
            }
        }
    }

    getParameters($url, $uris) {
        this.Params = new Object();
        var arr = Object.values($url),
            ures = [];
        $uris.forEach((val) => {
            ures.push(val);
        });
        arr.forEach((val) => {
            this.Params[ures[val].replace(':', '')] = (isNaN(this.GetUri().All()[val])) ? this.GetUri().Filter(this.GetUri().All()[val]) : parseInt(this.GetUri().All()[val]);
        });
        return this.Params;
    }

    postParameters($url) {
        delete $url[0];
        $url = $url.filter((val) => {
            return val != 'undefined';
        });
        var achados = [];
        $url.forEach((val, index) => {
            if (val.indexOf(':') != -1) {
                achados.push(index);
            }
        });
        return achados;
    }

    /* RENDERIZA O HTML COM JS */

    DomRender($code) {
        return (document.querySelectorAll(`[khan-app='${this.app}']`).length > 0) ? document.querySelector(`[khan-app='${this.app}']`).innerHTML += $code : this.Log('Erro ! Não Existe a View "' + this.app + '"');
    }
    /* FAZ O CACHE DO CODIGO RENDERIZADO*/
    CachePage(_page, call) {

        if (sessionStorage.getItem(_page)) {

            call(window.atob(sessionStorage.getItem(_page)));
            return false;

        } else {

            return true;

        }

    }

    PageRender($page, $callback = () => {}) {
        //if(this.CachePage($page, $callback)){
        var $request = new XMLHttpRequest();
        $request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //sessionStorage.setItem($page, window.btoa(this.responseText));
                $callback(this.responseText);
            }
        };
        $request.open("GET", $page, true);
        $request.send();
        //}
    }

    /* FUNCOES DE DEBUG */

    Debug() {
        return {
            Log(str) {
                console.log(str);
            },
            Erro(str) {
                throw str;
            },
            Debug() {
                debugger;
            }
        };
    }

}

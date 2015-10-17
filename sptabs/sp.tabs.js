/*SP-Tabs 1.0 by wideserg*/

var SPTabs = function(tabs) {

    var tabsStyles = '.tabs {\
        border-bottom: 1px solid #ddd;\
        content: " ";\
        display: table;\
        margin-bottom: 0;\
        padding-left: 0;\
        list-style: none;\
        width: 100%;\
        }\
    .tabs > li {\
        float: left;\
        margin-bottom: -1px;\
        position: relative;\
        display: block;\
        }\
    .tabs > li > a {\
        margin-right: 2px;\
        line-height: 1.42857143;\
        border: 1px solid transparent;\
        position: relative;\
        display: block;\
        padding: 10px 15px;\
        }\
    .tabs a {\
        color: #428bca;\
        text-decoration: none;\
        }\
    .ms-formtable tr { display: none; }\
    .ms-formbody tr { display: initial;}';

    var activeTabStyleFormat = ".tabs > li.{0} > a, .tabs > li.{0} > a:hover, .tabs > li.{0} > a:focus {{\
                                            color: #555;\
                                            background-color: #fff;\
                                            border: 1px solid #ddd;\
                                            border-bottom-color: transparent;\
                                            cursor: default;\
                                            }}";

    var vanila = v = (function(o) {

        var stylesCache = {};

        o.addCss = function(styles, id) {

            var style = stylesCache[id];

            if (!style) {
                style = document.getElementById(id);
            }

            if (!style) {
                style = document.createElement("style");
                style.setAttribute('id', id);
                style.innerHTML = styles;
                document.head.appendChild(style);

            } else {
                style.innerHTML = styles;
            }

            stylesCache[id] = style;
        };

        o.domReady = function(fn) {

            function onReady(event) {
                document.removeEventListener("DOMContentLoaded", onReady);
                fn.call(window, event);
            }

            function onReadyIe(event) {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", onReadyIe);
                    fn.call(window, event);
                }
            }

            if (document.addEventListener)
                document.addEventListener("DOMContentLoaded", onReady);
            else if (document.attachEvent)
                document.attachEvent("onreadystatechange", onReadyIe);
        };

        o.addClass = function(el, className) {

            el.className += className;
        };

        o.prepend = function(insert, before) {

            var parentOfWebPart = before.parentNode;
            parentOfWebPart.insertBefore(insert, before);
        };

        o.firstParent = function(el, tag) {

            var parent = el.parentNode;
            if (!parent)
                return null;

            return parent.tagName.toLowerCase() === tag.toLowerCase() ? parent : o.firstParent(parent, tag);
        };

        return o;
    })({});

    v.addCss(tabsStyles, "sprapidtabs");

    var tabsObj = tabs || [
        ["General", ["Title", "col1", "col2", "col3"]],
        ["Work", ["col4", "col5"]],
        ["Other", ["col6", "col7"]]
    ];

    var tabsContext = {};
    tabsContext.OnPreRender = TabsOnPreRender;
    tabsContext.Templates = {};
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(tabsContext);

    function TabsOnPreRender(ctx) {

        if (!window.currentFormUniqueId) { //we need to fix this to run only once, because item forms call this method for each field.

            window.currentFormUniqueId = ctx.FormUniqueId;
            window.currentFormWebPartId = "WebPart" + ctx.FormUniqueId;

            v.domReady(function() {

                _createTabs();
                _markFieldRows();

                var startIndex = _getStartTabIndex();
                _showTabControls(startIndex);
            });
        }
    }

    function _createTabs() {

        var tabClass;
        var tabsHTML = "";

        for (var i = 0; i < tabsObj.length; i++) {

            var tabName = tabsObj[i][0];
            tabsHTML += String.format("<li class='{0}'><a href='#tab{1}'>{0}</a></li>", tabName, i);
        }

        var ul = document.createElement('ul');
        ul.setAttribute('class', 'tabs');
        ul.innerHTML = tabsHTML;
        var currentFormWebPart = document.getElementById(currentFormWebPartId);
        v.prepend(ul, currentFormWebPart);

        [].forEach.call(document.querySelectorAll('.tabs li a'), function(a) {

            a.onclick = function(e) {

                var link = this;
                var currentIndex = _getTabId(link.getAttribute('href'));
                _showTabControls(currentIndex);
            };
        });
    }

    function _markFieldRows() {

        var titles = document.querySelectorAll("#" + window.currentFormWebPartId + " .ms-formtable tr nobr");

        [].forEach.call(titles, function(t) {

            for (var j = 0; j < tabsObj.length; j++) {

                var tabConfig = tabsObj[j];

                if (tabConfig[1].indexOf(t.innerHTML) !== -1) {
                    var parentTr = v.firstParent(t, 'tr');

                    if (parentTr) {
                        v.addClass(parentTr, tabConfig[0]);
                    }
                }
            }
        });
    }

    function _getStartTabIndex() {

        var startIndex = 0;
        if (/tab\d/.test(location.hash)) {
            startIndex = _getTabId(location.hash);
        }

        return startIndex >= 0 && startIndex < tabsObj.length ? startIndex : 0;
    }

    function _getTabId(idString) {
        return idString.match(/tab\d/)[0].match(/\d/)[0];
    }

    function _showTabControls(index) {
        var tabClassName = tabsObj[index][0];
        var id = "showscript";
        var fieldsStyles = String.format("#{0} .ms-formtable tr.{1} {{ display: inline; }} ", window.currentFormWebPartId, tabClassName);
        var headerStyles = String.format(activeTabStyleFormat, tabClassName);

        v.addCss(fieldsStyles + headerStyles, id);
    }
};

SPTabs([
    ["General", ["Title", "country", "location_type", "col1"]],
    ["Work", ["local language", "col2", "col3"]],
    ["Other", ["Big Col Name 1", "Big Col Name 2", "Big Col Name 3", "Big Col Name 4", "Big Col Name 5"]]
]);
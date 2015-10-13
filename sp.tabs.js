var SPTabs = function(tabs) {

    (window.jQuery || document.write('<script src="//ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.0.min.js"></script>'));

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


    var stylesCache = {};

    function addCss(styles, id) {

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
    }

    addCss(tabsStyles, "sprapidtabs");

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

            jQuery(document).ready(function() {

                var tabClass;
                var tabsHTML = "";

                for (var i = 0; i < tabsObj.length; i++) {

                    var tabName = tabsObj[i][0];
                    tabsHTML += String.format("<li class='{0}'><a href='#tab{1}'>{0}</a></li>", tabName, i);
                }

                jQuery("#" + window.currentFormWebPartId).prepend(String.format("<ul class='tabs'>{0}</ul>", tabsHTML));

                jQuery('.tabs li a').on('click', function(e) {

                    var currentIndex = jQuery(this).attr('href').replace("#", "");
                    showTabControls(currentIndex);

                    //e.preventDefault();
                });

                var trs = jQuery("#" + window.currentFormWebPartId + " .ms-formtable tr");

                for (index in tabsObj) {

                    var tabConfig = tabsObj[index];

                    for (var i = 0; i < tabConfig[1].length; i++) {

                        var tr = jQuery(".ms-standardheader:contains('" + tabConfig[1][i] + "')", trs)

                        if (tr.length) {
                            tr.parents('tr:first').addClass(tabConfig[0]);
                        }
                    }
                }

                var startIndex = 0;
                if (/tab\d/.test(location.hash))
                    startIndex = location.hash.match(/tab\d/)[0].match(/\d/)[0];

                showTabControls(startIndex >= 0 && startIndex < tabsObj.length ? startIndex : 0);
            });
        }
    }

    function showTabControls(index) {
        var tabClassName = tabsObj[index][0];
        var id = "showscript";
        var fieldsStyles = String.format("#{0} .ms-formtable tr.{1} {{ display: initial; }} ", window.currentFormWebPartId, tabClassName);
        var headerStyles = String.format(".tabs > li.{0} > a, .tabs > li.{0} > a:hover, .tabs > li.{0} > a:focus {{\
											color: #555;\
											background-color: #fff;\
											border: 1px solid #ddd;\
											border-bottom-color: transparent;\
											cursor: default;\
											}}", tabClassName);

        addCss(fieldsStyles + headerStyles, id);
    }
};

SPTabs([
    ["General", ["Title", "col1", "col2", "col3"]],
    ["Work", ["col4", "col5"]],
    ["Other", ["col6", "col7"]]
]);
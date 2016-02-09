_spBodyOnLoadFunctions.push(function() {

    SPScrollTop();
});

var SPScrollTop = function(options) {

    var _defaults = {
        showOn: 200,
        speed: 800,
        bgColor: 'gray',
        textColor: 'white',
        useThemColor: true,
        text: "Top ^",
        opacity: 0.5
    };

    var o = options ? fillDefault(options, _defaults) : _defaults;

    var topElement = document.getElementById("s4-workspace");

    var goTopLink = document.createElement('div');
    goTopLink.style.position = "fixed";
    goTopLink.style.bottom = "0px";
    goTopLink.style.height = "20px";
    goTopLink.style.width = "100%";
    goTopLink.style.cursor = "pointer";
    goTopLink.style.opacity = o.opacity;
    goTopLink.style.direction = "rtl";
    goTopLink.style.textIndent = "30px";
    goTopLink.style.textAlign = "right";
    goTopLink.style.display = 'none';
    goTopLink.style.fontWeight = 'bold';
    goTopLink.style.color = o.textColor;

    if (o.useThemColor) {
        goTopLink.className = "ms-emphasis";
    } else {
        goTopLink.style.backgroundColor = o.bgColor;
    }

    goTopLink.innerText = o.text;

    topElement.appendChild(goTopLink);

    Sys.UI.DomEvent.addHandler(goTopLink, 'click', scrollUp);

    var isShown = false;
    var scrollUpIsFinished = true;

    Sys.UI.DomEvent.addHandler(document.getElementById("s4-workspace"), 'scroll', function(e) {

        if (scrollUpIsFinished) {

            if (e.target.scrollTop > o.showOn) {

                if (!isShown) {
                    fadeInExtra(goTopLink, null, null, o.opacity);
                    isShown = true;
                }
            } else {
                if (isShown) {
                    SPAnimationUtility.BasicAnimator.FadeOut(goTopLink, null, null);
                    isShown = false;
                }
            }
        }
    });


    function fillDefault(baseObj, defaultObj) {

        var keys = Object.keys(baseObj);

        for (var key in defaultObj) {
            baseObj[key] = keys.indexOf(key) === -1 ? defaultObj[key] : baseObj[key];
        }

        return baseObj;
    }

    function scrollTop(element, to, duration) {
        scrollUpIsFinished = false;

        if (duration <= 0) {
            scrollUpIsFinished = true;
            return;
        }

        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(function() {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop == to) {

                scrollUpIsFinished = true;
                return;
            }
            scrollTop(element, to, duration - 10);
        }, 10);
    }

    function scrollUp() {
        scrollTop(topElement, 0, o.speed);
        goTopLink.style.display = 'none';
    }

    function fadeInExtra(a, c, d, opacity) {
        if (a == null)
            return;
        SetOpacity(a, 0);
        if (a.style.display == "none")
            a.style.display = "";
        if (a.style.visibility == "hidden")
            a.style.visibility = "";
        var b = new SPAnimation.State;
        b.SetAttribute(SPAnimation.Attribute.Opacity, opacity);
        var e = new SPAnimation.Object(SPAnimation.ID.Basic_QuickShow, 0, a, b, c, d);
        e.RunAnimation()
    }
};
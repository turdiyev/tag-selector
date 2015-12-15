/**
 * Created by sherali on 12/15/15.
 */

$(document).ready(function () {
    $.fn.tagSelector = function (options) {
        //settings
        var settings = $.extend({}, $.fn.tagSelector.defaultOptions, options);
        var TS = {
            initialize: function (wrapper) {
                this.dom.wrapper.tagName = wrapper;
                this.createDOMElements();

                this.attachHandlers();

                return this;
            },

            createDOMElements: function () {
                this.dom.wrapper.tagName.html("");
                this.dom.wrapper.tagName.addClass(this.dom.wrapper.className);
                this.dom.wrapper = this.dom.wrapper.tagName;

                this.dom.inputBox = this.appendDOMElement(this.dom.inputBox);
                this.dom.wrapper.append(this.dom.inputBox);

                this.dom.input = this.appendDOMElement(this.dom.input);
                this.dom.input.attr("tabindex", 103);
                this.dom.inputBox.append(this.dom.input);


                this.dom.tag = this.appendDOMElement(this.dom.tag);

                this.dom.close = this.appendDOMElement(this.dom.close);
                this.dom.close.text("x");
                this.dom.tag.html(this.dom.close.clone());

                this.dom.tagGroup = this.appendDOMElement(this.dom.tagGroup);
                this.dom.inputBox.prepend(this.dom.tagGroup);


                this.dom.optionBox = this.appendDOMElement(this.dom.optionBox);
                this.dom.wrapper.append(this.dom.optionBox);

                this.dom.box = this.appendDOMElement(this.dom.box);

            },

            attachHandler: function (element, handler, eventType, options) {
                eventType = eventType || 'click';

                if (typeof element == "string") {
                    TS.documentBody.on(eventType, element, handler);
                } else {
                    $(element).on(eventType, handler);
                }
            },

            attachHandlers: function () {
                var lastKey = "";

                this.attachHandler(this.dom.inputBox, function (ev) {
                    TS.dom.input.focus();
                });
                this.attachHandler("." + this.dom.box.attr("class"), function (ev) {
                    var i = $(this).attr("data-index");
                    var tagName = TS.arrayOfPopup[i].name;
                    if (tagName) {

                        reset();
                        var tag = TS.dom.tag.clone();
                        tag.html(tagName);
                        TS.dom.tagGroup.append("\n");

                        TS.dom.close.text("x");
                        tag.append(TS.dom.close.clone());
                        TS.dom.tagGroup.append(tag);
                        TS.dom.tagGroup.append("\n");

                    }
                });

                this.attachHandler(".close", function (ev) {
                    $(this).parent().remove();
                });

                this.attachHandler(this.dom.input, function (ev) {
                    TS.searchKey = ev.target.value;
                    if (!TS.searchKey) {
                        TS.dom.optionBox.hide();
                    } else if (lastKey != TS.searchKey) {
                        TS.dom.optionBox.show();

                        if ($.isFunction(settings.complete)) {
                            1
                            settings.complete.call(TS, TS.searchKey);
                        }
                    }
                    lastKey = TS.searchKey;
                }, "keyup");
                function reset() {
                    TS.searchKey = "";
                    lastKey = TS.searchKey;
                    TS.dom.input.val("");
                    TS.dom.input.focus();
                    TS.dom.optionBox.hide();
                }
            },

            appendDOMElement: function (dom) {
                var option = {class: dom.className};
                switch (dom.tagName) {
                    case "span":
                    case "div":
                    case "i":
                        break;
                    case "input":
                        option.type = "text";
                        break;
                }
                return $("<" + dom.tagName + "/>", {"class": dom.className});
            },
            setOptionContent: function (array) {

                if (Array.isArray(array) && array.length) {
                    this.arrayOfPopup = array;
                    var html = "";
                    this.dom.optionBox.html(html);
                    for (i = 0, len = array.length; i < len; i++) {
                        html = '<div>';
                        html += '<span class="tag-item">' + array[i].name + '</span> ';
                        html += '<span class="tag-stat"> x' + array[i].stat + '</span> ';
                        html += '<p class="short-description">' + array[i].shortDesc + '</p> ';
                        html += '<a class="tag-more" href="' + array[i].moreLink + '">Batafsil</a> ';
                        html += '</div> ';
                        var box = this.dom.box.clone();
                        box.attr("data-index", i);
                        box.attr("tabindex", 103);

                        box.html(html)
                        this.dom.optionBox.append(box);
                    }
                } else {
                    alert("Please, give me array( [ {name:, stat:, moreLink:, shortDesc:, desc:}, ...])")
                }
            },

            setCSSLeft: function (elem, left) {
                elem.css({
                    left: left
                });
            },

            setTranslateX: function (elem, x) {
                elem.css({
                    transform: "translateX(" + x + "px)",
                    webkitTransform: "translateX(" + x + "px)"
                });
            },

            documentBody: $('body'),
            dom: {
                wrapper: {
                    tagName: "div",
                    className: "tag-selector"
                },
                tagGroup: {
                    tagName: "span",
                    className: "tag-items"
                },
                tag: {
                    tagName: "span",
                    className: "tag-item"
                },
                close: {
                    tagName: "i",
                    className: "close"
                },
                inputBox: {
                    tagName: "div",
                    className: "tag-input-box"
                },
                input: {
                    tagName: "input",
                    className: "tag-input"
                },
                optionBox: {
                    tagName: "div",
                    className: "tag-options"
                },
                box: {
                    tagName: "div",
                    className: "box"
                }
            },
            width: null,
            searchKey: "",
            arrayOfPopup: []
        };

        return TS.initialize($(this));
    };

    $.fn.tagSelector.defaultOptions = {
        placeholder: "Tegni kiriting!",
        search: null,//function
        load: null,//function
        complete: null//function
    };
});
function TagObject(name, stat, moreLink, shortDesc, desc) {
    this.name = name;
    this.shortDesc = shortDesc;
    this.desc = desc;
    this.moreLink = moreLink;
    this.stat = stat;
};
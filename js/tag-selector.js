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
                this.dom.input.attr("tabindex", 3);
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
                    var obj = TS.listOfOption[i];
                    if (obj && obj.name && TS.selectedTagIdList.indexOf(obj.id) === -1) {

                        reset();
                        var tag = TS.dom.tag.clone();
                        tag.attr("data-id", obj.id);
                        tag.html(obj.name);
                        TS.dom.tagGroup.append("\n");
                        TS.dom.close.text("x");

                        tag.append(TS.dom.close.clone());
                        TS.dom.tagGroup.append(tag);
                        TS.dom.tagGroup.append("\n");

                        TS.selectedTagNameList.push(obj.name);
                        TS.selectedTagIdList.push(obj.id);
                        TS.dom.wrapper.attr("data-tags", TS.selectedTagNameList);

                        if ($.isFunction(settings.selectTag)) {
                            settings.selectTag.call(TS, TS.selectedTagNameList, TS.selectedTagIdList);
                        }
                    }
                });

                this.attachHandler(".close", function (ev) {
                    var tag = $(this).parent();
                    var id = tag.attr("data-id");
                    var obj = TS.listOfOption.filter(function (item) {
                        return item.id = id;
                    });
                    console.log(i, TS.listOfOption, TS.selectedTagIdList, obj);
                    tag.remove();
                    var findIndex = TS.selectedTagIdList.indexOf(obj.id);
                    TS.selectedTagNameList.splice(findIndex, 1);
                    TS.selectedTagIdList.splice(findIndex, 1);

                });

                this.attachHandler(this.dom.input, function (ev) {
                    TS.searchKey = ev.target.value;
                    if (!TS.searchKey) {
                        TS.dom.optionBox.hide();
                    } else if (lastKey != TS.searchKey) {


                        if ($.isFunction(settings.search)) {
                            settings.search.call(TS, TS.searchKey);
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

            setTagsList: function (list) {
                TS.dom.wrapper.attr("data-tags", TS.selectedTagNameList);
                if ($.isFunction(settings.selectTag)) {
                    settings.selectTag.call(TS, TS.selectedTagNameList, TS.selectedTagIdList);
                }
            },
            setOptionContent: function (array) {
                if (Array.isArray(array) && array.length) {
                    this.listOfOption = array;
                    var html = "";
                    this.dom.optionBox.html(html);
                    for (i = 0, len = array.length; i < len; i++) {
                        if (this.selectedTagIdList.indexOf(array[i].id) === -1) {
                            html = '<div>';
                            html += '<span class="tag-item" data-id="' + array[i].id + '">' + array[i].name + '</span> ';
                            html += '<span class="tag-stat"> x' + array[i].stat + '</span> ';
                            html += '<p class="short-description">' + array[i].shortDesc + '</p> ';
                            html += '<a class="tag-more" href="' + array[i].moreLink + '">Batafsil</a> ';
                            html += '</div> ';
                            var box = this.dom.box.clone();
                            box.attr("data-index", i);
                            box.attr("id", array[i].id);
                            box.attr("tabindex", 3);

                            box.html(html)
                            this.dom.optionBox.append(box);
                            TS.dom.optionBox.show();
                        }
                    }
                } else {
//                    this.dom.optionBox.html("");
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
                return $("<" + dom.tagName + "/>", option);
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
            selectedTagNameList: [],
            selectedTagIdList: [],
            listOfOption: []
        };

        return TS.initialize($(this));
    };

    $.fn.tagSelector.defaultOptions = {
        placeholder: "Tegni kiriting!",
        search: null,//function
        selectTag: null,
        load: null,//function
        search: null//function
    };
});
function TagObject(name, stat, moreLink, shortDesc, desc) {
    this.name = name;
    this.shortDesc = shortDesc;
    this.desc = desc;
    this.moreLink = moreLink;
    this.stat = stat;
};
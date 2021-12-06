/* eslint-disable */
function pluginStrings() {
  return {
    // Add some translations
    langs: {
      en: {
        inpageLabels: 'Manage in-page link labels',
        createLabel: 'Create',
        removeLabel: 'Remove',
        createLabelDlgTitle: 'Label for in-page link',
        dlgNameField: 'Label name',
        warnEmpty: 'Label name should not be empty',
        warnBadSymbolInName: 'Label name should contain letters and digits only',
        warnNameFirstNotLetter: 'Label name should start with a letter',
        warnNameExists: 'Label with the same name already exists.\nChoose another name',
        warnBadCaretPos: 'Label can not be created in the current position.\nTags permitted for label:\nparagrph,header,list item'
      },
      ru: {
        inpageLabels: 'Метки для внутристраничных ссылок',
        createLabel: 'Создать',
        removeLabel: 'Удалить',
        createLabelDlgTitle: 'Метка для внутристраничной ссылки',
        dlgNameField: 'Имя метки',
        warnEmpty: 'Имя метки не должно быть пустым',
        warnBadSymbolInName: 'Имя метки должно состоять только из латинских букв и цифр и\nне должно содержать пробелов и всяких закорючек',
        warnNameFirstNotLetter: 'Имя метки должно начинаться с буквы',
        warnNameExists: 'Метка с таким именем уже существует.\nВыберите другое имя',
        warnBadCaretPos: 'Недопустимая позиция для создания метки.\nОбъектами метки могут быть:\nпараграф,заголовок,элемент списка'
      }
    }
  };
}

function WarnDlg(content, title) {
  var $modal = $('.trumbowyg-editor').trumbowyg('openModal', {
    title: title,
    content: content,
  });
  // Nothing to do with Confirm button. Remove it.
  $modal.find('.trumbowyg-modal-box .trumbowyg-modal-button.trumbowyg-modal-submit').remove();
  
  $modal.on('tbwcancel', function(e) {
      $('.trumbowyg-editor').trumbowyg('closeModal');
  });

}

function checkLabelName(trumbowyg, lbl) {
  if (!lbl) {
    return trumbowyg.lang.warnEmpty;
  }
  if (!lbl.match(/^[0-9a-z]+$/)) {
    return trumbowyg.lang.warnBadSymbolInName;
  }
  if (!lbl.charAt(0).match(/^[a-z]+$/)) {
    return trumbowyg.lang.warnNameFirstNotLetter;
  }
  var existingLabels = $('.trumbowyg-editor .in-page-label').map(function () {
    return $(this).attr('id');
  });
  if ($.inArray(lbl, existingLabels) !== -1) {
    return trumbowyg.lang.warnNameExists;
  }
  return "";
}

function clearvalidationinfo() {
  $(".ipl-plugin-validation-text").text("");  
}

function CreateLabelDlg(trumbowyg, succsessCallback ) {
  var contentHtml=
    '<div class="trumbowyg-input-row">'
      + '<div class="trumbowyg-input-infos">'
        + '<label for="lbl0000Name">'
        + trumbowyg.lang.dlgNameField
        + '</label>'
      + '</div>'
      + '<div class="trumbowyg-input-html">'
        + '<input id="lbl0000Name" type="text" style="text-transform: lowercase" onkeypress="clearvalidationinfo()"></input>'
      + '</div>'
    + '</div>'
    + '<div class="ipl-plugin-validation-text"></div>';

  var $modal = $('.trumbowyg-editor').trumbowyg('openModal', {
    title: trumbowyg.lang.createLabelDlgTitle,
    content: contentHtml
  });
  
  $modal.on('tbwconfirm', function(e){
    var inputText=$modal.find("#lbl0000Name").val();
    var checkNameInfo=checkLabelName(trumbowyg, inputText);
    if(checkNameInfo) {
      $modal.find(".ipl-plugin-validation-text").text(checkNameInfo);
      return;
    }
    $('.trumbowyg-editor').trumbowyg('closeModal');
    succsessCallback(inputText);
  });
  $modal.on('tbwcancel', function(e){
      $('.trumbowyg-editor').trumbowyg('closeModal');
  });
}

function findPermittedNode(trwRange) {
  if (!trwRange) {
    return null;
  }
  var permittedTags=['li','h6','h5','h4','h3','h2','h1','p'];
  for (var i=0; i<permittedTags.length; i++) {
    var nodeToLabel=trwRange.commonAncestorContainer.parentElement.closest(permittedTags[i]);
    if(nodeToLabel)
      return nodeToLabel;   
  }
  return null;
}

(
  function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, pluginStrings() );
    // Plugin default options
    var defaultOptions = {
    };

    function buildDropdown(trumbowyg) {
      var dropdown = [];
      var itemCreName = 'in-page-label-create';
      var itemCreateDef = {
        text: trumbowyg.lang.createLabel,
        hasIcon: false,
        fn: function () {
          trumbowyg.saveRange();
          var nodeForLabel = findPermittedNode(trumbowyg.range);
          if (nodeForLabel) {
            CreateLabelDlg(trumbowyg,
              function (labelId) {
                nodeForLabel.setAttribute("id", labelId);
                nodeForLabel.classList.add("in-page-label");
              });
          }   
          else
            WarnDlg(trumbowyg.lang.warnBadCaretPos, trumbowyg.lang.createLabelDlgTitle);
        },
      };
      trumbowyg.addBtnDef(itemCreName, itemCreateDef);
      dropdown.push(itemCreName);
      var itemRemoveName = 'in-page-label-remove';
      var itemRemoveDef = {
        text: trumbowyg.lang.removeLabel,
        hasIcon: false,
        fn: function fn() {
          trumbowyg.saveRange();
          if (!trumbowyg.range) { return; }
          var nodeToRemoveLabel = findPermittedNode(trumbowyg.range);
          if (nodeToRemoveLabel && nodeToRemoveLabel.classList.contains('in-page-label')) {
            nodeToRemoveLabel.classList.remove('in-page-label');
            nodeToRemoveLabel.removeAttribute('id');
          }
        }
      };
      trumbowyg.addBtnDef(itemRemoveName, itemRemoveDef);
      dropdown.push(itemRemoveName);
      return dropdown;
    }

    $.extend(true, $.trumbowyg, {
      // Register plugin in Trumbowyg
      plugins: {
        inpageLabels: {
          // Code called by Trumbowyg core to register the plugin
          init : function init(trumbowyg) {
            // Fill current Trumbowyg instance with the plugin default options
            // eslint-disable-next-line no-param-reassign
            trumbowyg.o.plugins.inpageLabels = $.extend(true, {},
              defaultOptions,
              trumbowyg.o.plugins.inpageLabels || {});
            var inPageLabelBtnDef = {
              dropdown: buildDropdown(trumbowyg),
              text: '#',
              title: trumbowyg.lang.inpageLabels,
              hasIcon: false,
            };
            trumbowyg.addBtnDef('inpageLabels', inPageLabelBtnDef);
          },
        },
      },
    });
  }(jQuery));

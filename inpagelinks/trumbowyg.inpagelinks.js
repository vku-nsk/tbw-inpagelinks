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

function WarnDlg(content, title = 'Warning') {
  const $modal = $('.trumbowyg-editor').trumbowyg('openModal', {
    title,
    content,
  });
  // remove Confirm button
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
  const existingLabels = $('.trumbowyg-editor .in-page-label').map(function () {
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
  let contentHtml=
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

  const $modal = $('.trumbowyg-editor').trumbowyg('openModal', {
    title: trumbowyg.lang.createLabelDlgTitle,
    content: contentHtml
  });
  
  $modal.on('tbwconfirm', function(e){
    const inputText=$modal.find("#lbl0000Name").val();
    const checkNameInfo=checkLabelName(trumbowyg, inputText);
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

function upToEditorChild(node) {
  if (!node) {
    return null;
  }
  if (!node.parentElement) {
    return null;
  }
  if (node.parentElement.classList.contains('trumbowyg-editor')) {
    return node;
  }
  return upToEditorChild(node.parentElement);
}

function isNodeAvailForLabel(node) {
  return (node.nodeName === 'P'
    || node.nodeName === 'LI'
    || node.nodeName === 'H1'
    || node.nodeName === 'H2'
    || node.nodeName === 'H3'
    || node.nodeName === 'H4'
    || node.nodeName === 'H5'
    || node.nodeName === 'H6');
}

function findNodeForCreateLabel(trwRange) {
  if (!trwRange) {
    return null;
  }
  let nodeForLabel = trwRange.commonAncestorContainer.parentElement;
  if (nodeForLabel && isNodeAvailForLabel(nodeForLabel)) { // для учёта LI
    return nodeForLabel;
  }
  nodeForLabel = upToEditorChild(trwRange.commonAncestorContainer.parentElement);
  if (!nodeForLabel) {
    return null;
  }
  if (isNodeAvailForLabel(nodeForLabel)) {
    return nodeForLabel;
  }
  return null;
}

(
  function ($) {
    'use strict';

    $.extend(true, $.trumbowyg, pluginStrings() );
    // Plugin default options
    const defaultOptions = {
    };

    function buildDropdown(trumbowyg) {
      const dropdown = [];
      const itemCreName = 'in-page-label-create';
      const itemCreateDef = {
        text: trumbowyg.lang.createLabel,
        hasIcon: false,
        fn: function () {
          trumbowyg.saveRange();
          let nodeForLabel = findNodeForCreateLabel(trumbowyg.range);
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
      const itemRemoveName = 'in-page-label-remove';
      const itemRemoveDef = {
        text: trumbowyg.lang.removeLabel,
        hasIcon: false,
        fn: function fn() {
          trumbowyg.saveRange();
          if (!trumbowyg.range) { return; }
          let nodeToRemoveLabel = trumbowyg.range.commonAncestorContainer.parentElement;
          // eslint-disable-next-line max-len
          if (!(nodeToRemoveLabel && isNodeAvailForLabel(nodeToRemoveLabel))) { // для учёта LI
            // eslint-disable-next-line max-len
            nodeToRemoveLabel = upToEditorChild(trumbowyg.range.commonAncestorContainer.parentElement);
          }
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
            const inPageLabelBtnDef = {
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

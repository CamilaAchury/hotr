// More renderers https://handsontable.com/blog/articles/getting-started-with-cell-renderers
function ctypeRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.DropdownRenderer.apply(this, arguments);
  td.className = 'table-ctype';
}

// https://docs.handsontable.com/5.0.1/tutorial-cell-types.html
function headRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.className = 'table-header';
}

invalidRenderer = function(
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  // td.style.backgroundColor = '#F00!important';
  td.className = 'invalidCell';
};
// var valiNumeric = /[0-9]/g;
var valiNumeric = function(value, callback) {
  if (/[0-9]/g.test(value)) {
    callback(true);
  } else {
    callback(false);
  }
};

var valiCategoric = function(value, callback) {
  if (/[a-z]/g.test(value)) {
    callback(true);
  } else {
    callback(false);
  }
};

var valiDate = function(value, callback) {
  if (
    /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|[+-][01]\d:[0-5]\d)$/.test(
      value
    )
  ) {
    callback(true);
  } else {
    callback(false);
  }
};

Handsontable.validators.registerValidator('valiNumeric', valiNumeric);
Handsontable.validators.registerValidator('valiCategoric', valiCategoric);
Handsontable.validators.registerValidator('valiDate', valiDate);

function formatDataParams(el) {
  var dataDic = JSON.parse(el.dataset.dic);
  var dataInput = JSON.parse(el.dataset.table);
  var hotOpts = JSON.parse(el.dataset.hotopts);
  var dataHeaders = [];
  dataHeaders[0] = dataDic.slice().reduce(function(final, item) {
    item.data = item.id;
    final[item.data] = item.ctype;
    return final;
  }, {});
  dataHeaders[1] = dataDic.slice().reduce(function(final, item) {
    item.data = item.id;
    final[item.data] = item.label;
    return final;
  }, {});

  var dataObject = dataHeaders.concat(dataInput);

  return {
    dataDic: dataDic,
    dataObject: dataObject,
    hotOpts: hotOpts
  };
}

function parseHotInput(d, userSelectedCols) {
  var letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  var ncols = d[0].length;
  var letter_ids = letters.slice(0, ncols);
  var dic = d.slice(0, 2).concat([letter_ids]);
  var data = d.slice(2);

  function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }

  function dicToDataframe(arr) {
    return arrayToObj(transpose(arr), ['ctype', 'label', 'id']);
  }

  function arrayToObj(arr, keys) {
    return arr.map(function(x) {
      var obj = x.reduce(function(acc, cur, i) {
        acc[keys[i]] = cur;
        return acc;
      }, {});
      return obj;
    });
  }

  var dic_ = dicToDataframe(dic);

  //SELECT columns at random
  var shuffled = dic_.sort(() => 0.5 - Math.random()); // shuffle
  var selected = shuffled.slice(0, 2); //get sub-array of first n elements AFTER shuffle
  // console.log('Selected columns');
  // console.log(selected);
  // console.log('Data')
  // console.log(JSON.stringify(arrayToObj(data, letter_ids)));

  return {
    data: arrayToObj(data, letter_ids),
    dic: dicToDataframe(dic),
    selectedCols: userSelectedCols
  };
}

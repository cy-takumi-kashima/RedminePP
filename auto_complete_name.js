// Redmineかどうか
var isRedmine = function() {
    var metaList = document.querySelectorAll('meta');
    var isRedmine = false;
    for (var i = 0; i < metaList.length; i++) {
	var meta = metaList[i];
	if (meta.name === "description" &&
	    meta.content === "Redmine") {
	    isRedmine = true;
	    break;
	}
    }
    return isRedmine;
}

var main = function() {
    // Redmineではない時はここまで
    if (!isRedmine()) {
	console.log('Redmineではありません');
	return;
    }

    console.log('Redmineであることを確認しました');
 
    // optionを連想配列に変換する // nameToId["Takumi Kashima"] = 123;
    var optionList = document.querySelectorAll('#issue_assigned_to_id option');
    var nameToId = {};
    for (var i = 0; i < optionList.length; i++) {
	var option = optionList[i];
        var name = option.text;
        var id = option.value;
        nameToId[name] = id;
    }

    // 関係者のみのラベルとボックスを削除する
    var onlyConcerned = document.querySelector('#only_concerned');
    if (onlyConcerned) {
	onlyConcerned.parentNode.removeChild(onlyConcerned);
    }
    var onlyConcernedLabel = document.querySelector('label[for=only_concerned]');
    if (onlyConcernedLabel) {
	onlyConcernedLabel.parentNode.removeChild(onlyConcernedLabel);
    }

    // セレクトボックスを取得して削除する
    var selectbox = document.querySelector('#issue_assigned_to_id');
    var baseNode = selectbox.parentNode;
    baseNode.removeChild(selectbox);
    
    // セレクトボックスの変わりに送信する隠れボックスを作る
    var sendInput = document.createElement('input');
    sendInput.setAttribute('type', 'hidden');
    sendInput.setAttribute('name', selectbox.name);
    sendInput.setAttribute('value', '');
    baseNode.appendChild(sendInput);

    // 入力で選択できる検索ボックスを作る
    var searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('value', '');
    searchInput.setAttribute('autocomplete', 'on');
    searchInput.setAttribute('list', 'assigned_list');
    searchInput.addEventListener('input', function() {
        // 入力された値が正しくなければここまで
        if (!(searchInput.value in nameToId)) {
	    sendInput.setAttribute('value', '');
	    return;
	}
	// IDを設定する
	var assignedId = nameToId[searchInput.value];
	sendInput.setAttribute('value', assignedId);
    }, false);
    baseNode.appendChild(searchInput);

    // 検索候補のdatalistを作る
    var dataList = document.createElement('datalist');
    dataList.setAttribute('id', 'assigned_list');

    var isMatch = false;
    for (var i = 0; i < optionList.length; i++) {
	var assigned = optionList[i];
        var assignedId = assigned.value;
        var name = assigned.text;
	var option = document.createElement('option');
	option.setAttribute('value', name);
	option.text = assignedId;
	// 選択ボックスで既に選ばれている人がいる時
	if (isMatch === false &&
	    selectbox.value === assigned.value) {
	    // 検索ボックスと送信ボックスにデータを入れる
	    searchInput.setAttribute('value', name);
	    sendInput.setAttribute('value', assignedId);
	    isMatch = true;
	}
	dataList.appendChild(option);
    }
    baseNode.appendChild(dataList);
}

main();

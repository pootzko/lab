/************************************************************
*===========================================================*
* - autokana -                                              *
*===========================================================*
*************************************************************
*
* Copyright (c) 2012, Tihomir Kit (kittihomir@gmail.com)
*
* autokana is released under MIT license
* http://lab.cmikavac.net/autokana/LICENSE.txt
*
************************************************************/



jQuery.fn.autokana = function() {
	// kana mapping
	var kana = [
		["tsu", "つ"],
		["TSU", "ツ"],
		["dji", "ぢ"], ["dzu", "づ"],
		["DJI", "ヂ"], ["DZU", "ヅ"],
		["kya", "きゃ"], ["kyu", "きゅ"], ["kyo", "きょ"],
		["sha", "しゃ"], ["shu", "しゅ"], ["sho", "しょ"],
		["cha", "ちゃ"], ["chu", "ちゅ"], ["cho", "ちょ"],
		["nya", "にゃ"], ["nyu", "にゅ"], ["nyo", "にょ"],
		["hya", "ひゃ"], ["hyu", "ひゅ"], ["hyo", "ひょ"],
		["mya", "みゃ"], ["myu", "みゅ"], ["myo", "みょ"],
		["rya", "りゃ"], ["ryu", "りゅ"], ["ryo", "りょ"],
		["gya", "ぎゃ"], ["gyu", "ぎゅ"], ["gyo", "ぎょ"],
		["jya", "じゃ"], ["jyu", "じゅ"], ["jyo", "じょ"],
		["dya", "ぢゃ"], ["dyu", "ぢゅ"], ["dyo", "ぢょ"],
		["bya", "びゃ"], ["byu", "びゅ"], ["byo", "びょ"],
		["pya", "ぴゃ"], ["pyu", "ぴゅ"], ["pyo", "ぴょ"],
		["KYA", "キャ"], ["KYU", "キュ"], ["KYO", "キョ"],
		["SHA", "シャ"], ["SHU", "シュ"], ["SHO", "ショ"],
		["CHA", "チャ"], ["CHU", "チュ"], ["CHO", "チョ"],
		["NYA", "ニャ"], ["NYU", "ニュ"], ["NYO", "ニョ"],
		["HYA", "ヒャ"], ["HYU", "ヒュ"], ["HYO", "ヒョ"],
		["MYA", "ミャ"], ["MYU", "ミュ"], ["MYO", "ミョ"],
		["RYA", "リャ"], ["RYU", "リュ"], ["RYO", "リョ"],
		["GYA", "ギャ"], ["GYU", "ギュ"], ["GYO", "ギョ"],
		["JYA", "ジャ"], ["JYU", "ジュ"], ["JYO", "ジョ"],
		["DYA", "ヂャ"], ["DYU", "ヂュ"], ["DYO", "ヂョ"],
		["BYA", "ビャ"], ["BYU", "ビュ"], ["BYO", "ビョ"],
		["PYA", "ピャ"], ["PYU", "ピュ"], ["PYO", "ピョ"],
		["ka", "か"], ["ki", "き"], ["ku", "く"], ["ke", "け"], ["ko", "こ"],
		["sa", "さ"], ["shi", "し"], ["su", "す"], ["se", "せ"], ["so", "そ"],
		["ta", "た"], ["chi", "ち"], ["te", "て"], ["to", "と"],
		["na", "な"], ["ni", "に"], ["nu", "ぬ"], ["ne", "ね"], ["no", "の"],
		["ha", "は"], ["hi", "ひ"], ["fu", "ふ"], ["he", "へ"], ["ho", "ほ"],
		["ma", "ま"], ["mi", "み"], ["mu", "む"], ["me", "め"], ["mo", "も"],
		["ra", "ら"], ["ri", "り"], ["ru", "る"], ["re", "れ"], ["ro", "ろ"],
		["ya", "や"], ["yu", "ゆ"], ["yo", "よ"],
		["wa", "わ"], ["wo", "を"],
		["nn", "ん"],
		["ga", "が"], ["gi", "ぎ"], ["gu", "ぐ"], ["ge", "げ"], ["go", "ご"],
		["za", "ざ"], ["ji", "じ"], ["zu", "ず"], ["ze", "ぜ"], ["zo", "ぞ"],
		["da", "だ"], ["de", "で"], ["do", "ど"],
		["pa", "ぱ"], ["pi", "ぴ"], ["pu", "ぷ"], ["pe", "ぺ"], ["po", "ぽ"],
		["ba", "ば"], ["bi", "び"], ["bu", "ぶ"], ["be", "べ"], ["bo", "ぼ"],
		["KA", "カ"], ["KI", "キ"], ["KU", "ク"], ["KE", "ケ"], ["KO", "コ"],
		["SA", "サ"], ["SHI", "シ"], ["SU", "ス"], ["SE", "セ"], ["SO", "ソ"],
		["TA", "タ"], ["CHI", "チ"], ["TE", "テ"], ["TO", "ト"],
		["NA", "ナ"], ["NI", "ニ"], ["NU", "ヌ"], ["NE", "ネ"], ["NO", "ノ"],
		["HA", "ハ"], ["HI", "ヒ"], ["FU", "フ"], ["HE", "ヘ"], ["HO", "ホ"],
		["MA", "マ"], ["MI", "ミ"], ["MU", "ム"], ["ME", "メ"], ["MO", "モ"],
		["RA", "ラ"], ["RI", "リ"], ["RU", "ル"], ["RE", "レ"], ["RO", "ロ"],
		["YA", "ヤ"], ["YU", "ユ"], ["YO", "ヨ"],
		["WA", "ワ"], ["WO", "ヲ"],
		["NN", "ン"],
		["GA", "ガ"], ["GI", "ギ"], ["GU", "グ"], ["GE", "ゲ"], ["GO", "ゴ"],
		["ZA", "ザ"], ["JI", "ジ"], ["ZU", "ズ"], ["ZE", "ゼ"], ["ZO", "ゾ"],
		["DA", "ダ"], ["DE", "デ"], ["DO", "ド"],
		["PA", "パ"], ["PI", "ピ"], ["PU", "プ"], ["PE", "ペ"], ["PO", "ポ"],
		["BA", "バ"], ["BI", "ビ"], ["BU", "ブ"], ["BE", "ベ"], ["BO", "ボ"],
		["kk", "っ"], ["ss", "っ"], ["tt", "っ"], ["pp", "っ"],
		["KK", "ッ"], ["SS", "ッ"], ["TT", "ッ"], ["PP", "ッ"],
		["a", "あ"], ["i", "い"], ["u", "う"], ["e", "え"], ["o", "お"],
		["A", "ア"], ["I", "イ"], ["U", "ウ"], ["E", "エ"], ["O", "オ"]
	];



	// upon entering a new letter, do roumaji to kana conversion if possible and set curor location
	this.keyup(function() {
		var input_field_string = this.value;

		// iterate through kana mapping and modify the input string if possible
		for (var i=0; i<kana.length; i++) {
			input_field_string = input_field_string.replace(kana[i][0], kana[i][1]);

			if (input_field_string != this.value)
				break;
		}

		// set the correct cursor location
		if (input_field_string != this.value) {
			var original_string = this.value.split("");

			// replace roumaji with kana in the textfield
			this.value = input_field_string;
			var new_string = input_field_string.split("");
			var tmp_new_length = new_string.length;

			for (var i=(original_string.length - 1); i>=0; i--) {
				var j = tmp_new_length - 1;

				if (original_string[i] != new_string[j]) {
					var offset = original_string.length - i;
					var current_position = new_string.length - offset + 1;
					break;
				}

				tmp_new_length--;
			}

			// reset cursor position
			$(this).setCursorPosition(current_position);
		}
	});
};





// reset cursor position (next to roumaji-kana conversion location)
jQuery.fn.setCursorPosition = function(current_position) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(current_position, current_position);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', current_position);
            range.moveStart('character', current_position);
            range.select();
        }
    });
};










const scryfall = require('scryfall');
const https = require('https');
const fs = require('fs');
const AdmZip = require('adm-zip');

var archive = new AdmZip();

const cards = fs.readFileSync('./cards').toString().replace(/\r/g, '').split('\n');
var clist =
    `mse_version: 2.0.2
game: magic
game_version: 2020-04-25
stylesheet: m15-future
stylesheet_version: 2018-06-01
set_info:
	symbol: 
	masterpiece_symbol: 
styling:
	magic-m15-future:
		text_box_mana_symbols: magic-mana-small.mse-symbol-font
		overlay: 
`;
var i = 1;
async function getImg(uri, n) {
    https.get(uri, (res) => {
        let b = [];
        res.on('data', (d) => b.push(d));
        res.on('end', () => {
            archive.addFile(`image${n}`, Buffer.concat(b));
        });
    });
}

cards.forEach(card => {
    let obj = {
        set: card.match(/\([a-zA-Z0-9]+\)/g)[0].replace(/[\(\)]/g, ''),
        num: card.match(/[0-9ps]+$/g)[0]
    };
    scryfall.getCard(obj.set, obj.num, (err, c) => {
        if (err) console.error(err);
        process.stdout.write(c.name+'                                      \r');
        let outC =
            //some garbage autoformatting dw about it
            `    notes: 
    time_created: 2022-05-13 03:20:32
    time_modified: 2022-05-13 03:25:21
    name: ${c.name}
    casting_cost: ${(c.mana_cost)?c.mana_cost.replace(/[\{\}]/gm, ''):''}
    image: ${(() => {
        if (!c.image_uris) return '';
        getImg(c.image_uris.art_crop, i); return `image${i++}`;
    })()}
    rarity: ${(c.rarity == 'mythic')?'mythic rare':c.rarity}
    super_type: <word-list-type>${c.type_line.split(' — ')[0]}</word-list-type>
    sub_type: ${(c.type_line.split(' — ').length < 2)?'':c.type_line.split(' — ')[1]}
    rule_text: \n\t\t${(c.oracle_text)?c.oracle_text.replace(/\n/gm, "\n\t\t").replace(/\{/gm, "<sym>").replace(/\}/gm, "</sym>"):''}
    flavor_text: 
    power: ${(c.power !== undefined)?c.power:''}
    toughness: ${(c.toughness !== undefined)?c.toughness:''}
    card_code_text: 
    illustrator: ${c.artist}
    copyright: 
    image_2: 
    copyright_2: 
    copyright_3: 
    mainframe_image: 
    mainframe_image_2: `;
        clist += `card:\n${outC}\n`;
    });
});

setTimeout(() => {
    archive.addFile('set', Buffer.from(clist.replace(/\ \ \ \ /gm, '\t')));
    archive.writeZip('./proxies.mse-set');
}, 10000);
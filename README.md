# HOW TO USE THIS PROGRAM
## and things to know
### currently doesn't generate dupes but you can fix that when printing
In the file called 'cards', put a decklist in Moxfield format (quantity, name, setcode, num):
```
1 Black Lotus (lea) 232
```
then run `download.js`:
```bash
node download.js
```
 A file called "proxies.mse-set" will be generated, containing a copy of each card in the decklist using the future sight border.
 !!sometimes the crop is jank, this is just a thing and idk how to fix it so I'm sorry!!

You can change the borders or convert to pngs in [Magic Set Editor](https://magicseteditor.boards.net/) (although if you didn't know that, I'm surprised you've read this far.)

For making cards printable, I reccommend [mtg-print.com](https://mtg-print.com), as they have an "upload custom card" option and a quantity selector.
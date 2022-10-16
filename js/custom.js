$(document).ready(function () {
    $.ajax({
        url: 'https://api.github.com/repos/islandauto/island-auto-gallery/contents/',
        success: function (contents) {
            const imgContent = contents.find(c => c.name === 'img');
            const { git_url } = imgContent;
            $.ajax({
                url: git_url,
                success: function (imgFolders) {
                    const imgFolderTrees = imgFolders.tree;
                    const carFolder = imgFolderTrees.find(c => c.path === 'car');
                    const { url } = carFolder;
                    $.ajax({
                        url : url,
                        success: function (data) {
                            const { tree } = data;
                            console.log(tree);
                            for (let i = 0; i < tree.length; i++) {
                                const { path } = tree[i];
                                $('#imagesContainer').prepend( `<img src="img/car/${path}" style="margin-bottom: 10px;" />`);
                            }
                        }
                    });
                }
            })
        }
    })
});

//https://stackoverflow.com/questions/39048654/how-to-enable-directory-indexing-on-github-pages
//https://api.github.com/repos/islandauto/island-auto-gallery/contents/
//https://api.github.com/repos/islandauto/island-auto-gallery/git/trees/46ef03e621f9201f025d2c9fdb593cd1f4418eb4

// const arrayBufferToBase64 = (buffer) => {
//     var binary = '';
//     var bytes = new Uint8Array( buffer );
//     var len = bytes.byteLength;
//     for (var i = 0; i < len; i++) {
//         binary += String.fromCharCode( bytes[ i ] );
//     }
//     return binary;
// }

// const bufferArrayToBase64Array = (data) => {
//     const base64Strings = [];
//     for (let i = 0; i < data.length; i++) {
//         const { id, base64, createdAt, name } = data[i];
//         const base64String = arrayBufferToBase64(base64.data);
//         base64Strings.push(base64String);
//     }
//     return base64Strings;
// }

// axios.get(`https://island-auto-manager.herokuapp.com/api`).then((res, err) => {
//     res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     const base64StringArray = bufferArrayToBase64Array(res.data);
//     for (let i = 0; i < base64StringArray.length; i++) {
//         const uri = `data:image/png;base64, ${base64StringArray[i]}`;
//         $('#imagesContainer').append(`<img src="${uri}" style="margin-bottom: 5px;" />`);
//     }
// });

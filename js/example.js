$(document).ready(function () {

    let s_unit;
    let displays = [];

    $('#modalSelectStation').modal('show');

    const appendDisplayButton = (display, disabled) => {
        $('#showDisplays').append(
            `<div class="col-12 check-div"> 
                <label class="btn btn-secondary mx-3 my-3 check-button ${disabled ? 'custom-disabled' : ''}">
                    <input class="inCheck px-5" type="checkbox" name="inSelectDisplay" value=${display.s_display_url} style="display: none;"/>
                    <span id="outCheckButtonIndex">&nbsp;</span>
                    <span id="name">${display.s_display_name}</span>
                </label>
                <i id=${display.id} class='fas fa-edit' />
            </div>`
        )
    }

    const renderDisplayButtons = (disabled) => {
        $('#showDisplays').empty();
        for (let i = 0; i < displays.length; i++) {
            const display = displays[i];
            appendDisplayButton(display, disabled);
        }
    }

    $('#btnSelectStation').on('click', function (e) {
        e.preventDefault();
        const station = $('#selectedStation').val();
        const username = $('#username').val();
        const password = $('#password').val();

        axios.post(`/login`, {
            data: {
                s_unit: station,
                username,
                password
            }
        }).then((res, err) => {
            displays = res.data;
            s_unit = station;
            $('#station').text(station);
            $('#modalSelectStation').modal('hide');
            renderDisplayButtons(true);
        });
    });

    let selected = [];
    let displayConfigSelect = false;
    let slideShowInterval = 300000;
    let validateNumSelected = true;
    localStorage.setItem('selectedItems', '');

    setInterval(function () { reload_page(); }, 60 * 180000);
    setInterval(function () { reloadPowerBi(); }, 60 * 10000);

    console.log(localStorage.getItem('setSlideShowInterval'));
    console.log(parseInt(JSON.parse(localStorage.getItem('setSlideShowInterval'))));

    if (localStorage.getItem('displayConfig') === 'select1x1') {
        slideShowInterval = localStorage.getItem('setSlideShowInterval') !== null ? parseInt(JSON.parse(localStorage.getItem('setSlideShowInterval'))) : 300000;
        setInterval(function () { rotateDisplay(); }, slideShowInterval);
    }

    console.log(slideShowInterval);

    function reload_page() {
        window.location.reload(true);
    }

    //alert(localStorage.getItem('displayConfig'));
    console.log(localStorage.getItem('selectedItems'));


    const powerBiUrls = [
        'https://app.powerbi.com/view?r=eyJrIjoiZDk3ODJhMzgtMzA0Yy00MDU4LTk0MjMtMmVhMGUzNTE0ZmEyIiwidCI6IjM2ZjljMDIyLTEyY2YtNDgzYy04OWM4LWI1ZWYxZjgwZGNjZSIsImMiOjF9'
    ];

    function reloadPowerBi() {
        for (let i = 0; i < powerBiUrls.length; i++) {
            document.getElementById(powerBiUrls[i]).src = document.getElementById(powerBiUrls[i]).src;
        }
    }

    function rotateDisplay() {
        const storeLinksArray = JSON.parse(localStorage.getItem('storeLinksArray'));
        console.log(storeLinksArray);
        console.log(slideShowInterval);

        let display;
        let currentIndex;

        //loop is to determine which link in storeLinksArray is currently being displayed.
        for (let i = 0; i < storeLinksArray.length; i++) {
            if (document.getElementById(storeLinksArray[i]) !== null) {
                //console.log(document.getElementById(storeLinksArray[i]));
                //console.log(document.getElementById(storeLinksArray[i]).src);
                currentIndex = i;
                display = i + 1;
                if (display === storeLinksArray.length) {
                    display = 0;
                }
                console.log(display);
                console.log(storeLinksArray[display]);
            }
        }

        //const jqueryFadeId = '#' + storeLinksArray[currentIndex].toString();
        //console.log(jqueryFadeId.toString());
        if (document.getElementById(storeLinksArray[currentIndex]) !== null) {
            $('#options1x1').css('visibility', 'visible');
            $('iframe').fadeOut();
            document.getElementById(storeLinksArray[currentIndex]).src = storeLinksArray[display];
            $('iframe').fadeIn();
            document.getElementById(storeLinksArray[currentIndex]).id = storeLinksArray[display];
        }

    }

    const checkEnableSubmit = () => {
        const underLimit = parseInt($('#outNumSelected').text()) <= parseInt($('#outMaxSelection').text());

        if (validateNumSelected) {
            console.log(`parseInt($('#outNumSelected').text()) = ${parseInt($('#outNumSelected').text())}\nparseInt($('#outMaxSelection').text()) = ${parseInt($('#outMaxSelection').text())}\n${parseInt($('#outNumSelected').text()) < parseInt($('#outMaxSelection').text())}`);
            console.log(underLimit);
            if (displayConfigSelect && underLimit) {
                $('.btnSubmit').attr('disabled', false);
            } else {
                $('.btnSubmit').attr('disabled', true);
            }
        } else {
            if (selected.length > 0) {
                $('.btnSubmit').attr('disabled', false);
            }
        }

        if (displayConfigSelect) {
            $('.check-button').removeClass('custom-disabled');
        } else {
            $('.check-button').addClass('custom-disabled');
        }

        if (!underLimit) {
            $('.out-num-selected').addClass('flashit');
        } else {
            $('.out-num-selected').removeClass('flashit');
            $('.inCheck').attr('disabled', false);
        }

    }

    checkEnableSubmit();


    const resetDisplayConfig = () => {
        $('#select1x1').find('img').attr('src', '/img/1x1.png');
        $('#select2x2').find('img').attr('src', '/img/2x2.png');
        $('#select3x3').find('img').attr('src', '/img/3x3.png');
        $('#select4x4').find('img').attr('src', '/img/4x4.png');

        $('#options1x1').css('visibility', 'hidden');
        $('#options2x2').css('visibility', 'hidden');
        $('#options3x3').css('visibility', 'hidden');
        $('#options4x4').css('visibility', 'hidden');

        $('#confirmation').empty();
    }

    $('.main-card').on('click', function () {
        //out-num-selected
        let maxSelection;
        let displayMaxSelection = true;

        resetDisplayConfig();
        if ($(this).attr('id') === 'select1x1') {
            $('#options1x1').css('visibility', 'visible');
            $(this).find('img').attr('src', '/img/1x1-selected.png');
            displayMaxSelection = false;
            validateNumSelected = false;
            maxSelection = 100;
            $('#modalSlideshowTimer').modal('show');
            //setInterval(function () { rotateDisplay(); }, 60 * 100);
        } else if ($(this).attr('id') === 'select2x2') {
            $('#options2x2').css('visibility', 'visible');
            $(this).find('img').attr('src', '/img/2x2-selected.png');
            maxSelection = 4;
        } else if ($(this).attr('id') === 'select3x3') {
            $('#options3x3').css('visibility', 'visible');
            $(this).find('img').attr('src', '/img/3x3-selected.png');
            maxSelection = 9;
        } else {
            $('#options4x4').css('visibility', 'visible');
            $(this).find('img').attr('src', '/img/4x4-selected.png');
            maxSelection = 16;
        }

        localStorage.setItem('displayConfig', $(this).attr('id'));
        displayConfigSelect = true;
        checkEnableSubmit();

        if (validateNumSelected) {
            $('#outMaxSelection').text(maxSelection);
            $('.out-num-selected').css('visibility', 'visible');
        } else {
            $('.out-num-selected').css('visibility', 'hidden');
        }
    });

    const generateDisplay = (linksArray) => {

        const displayConfig = localStorage.getItem('displayConfig');

        let htmlBlock = '';
        let rows;
        let cols;
        let setCol;
        let rowHeight;
        let subtitle = 'Ready to Display ';

        console.log(displayConfig === 'select2x2');

        if (displayConfig === 'select1x1') {
            rows = 1;
            cols = 1;
            setCol = 12;
            rowHeight = 'full-height';
            localStorage.setItem('storeLinksArray', JSON.stringify(linksArray));
            subtitle += 'Rotatating 1 x 1 Configuration';
        } else if (displayConfig === 'select2x2') {
            rows = 2;
            cols = 2;
            setCol = 6;
            rowHeight = 'half-height';
            subtitle += '2 x 2 Configuration';
        } else if (displayConfig === 'select3x3') {
            rows = 3;
            cols = 3;
            setCol = 4;
            rowHeight = 'third-height';
            subtitle += '3 x 3 Configuration';
        } else {
            rows = 4;
            cols = 4;
            setCol = 3;
            rowHeight = 'quarter-height';
            subtitle += '4 x 4 Configuration';
        }

        console.log(`rows: ${rows}\n cols: ${cols}`);

        let count = 0;

        for (let i = 0; i < rows; i++) {

            console.log(`for loop run: ${i}`);

            let row = `
                <div class='row ${rowHeight} no-border'>
            `;

            console.log(row);

            for (let j = 0; j < cols; j++) {
                row += `
                    <div class='col-${setCol} px-0 no-border'>
                        <iframe 
                            id='${linksArray[count]}'
                            src='${linksArray[count]}'
                            class='fill-container'
                            frameBorder="0"
                        ></iframe>
                    </div>
                `;
                count++;
            }

            row += `
                </div>
            `;

            //console.log(row);

            $('#outDisplay').append(row);
            htmlBlock += row;
        }
        $('#subtitle').text(subtitle);

        console.log(htmlBlock);
        localStorage.setItem('htmlBlock', htmlBlock);
    }

    //console.log(localStorage.getItem('displayConfig'));
    $('#outDisplay').append(localStorage.getItem('htmlBlock'));
    //console.log(localStorage.getItem('htmlBlock'));

    $('.btnSubmit').on('click', function () {
        generateDisplay(selected);
        $('#title').addClass('pulse');
    });

    const renumberOutCheckButtonIndex = (index) => {

        //console.log(index); //index = 1, need to change everything over index of 1 = 2,3

        //const checkButtons = $(document).find('#outCheckButtonIndex');

        //let checkButtons = [];

        //$('#outCheckButtonIndex').each(function () {
        //    checkButtons.push($(this));
        //});

        const checkButtons = $(document).find('.check-button');

        console.log(checkButtons);

        for (let i = index; i < checkButtons.length; i++) {
            //console.log(checkButtons.eq(i)[0].children[1]);
            const num = $(checkButtons.eq(i)[0].children[1]);
            console.log(isNaN(parseInt(num.text())));
            if (!isNaN(parseInt(num.text()))) {
                console.log(checkButtons.eq(i).text());
                const newNum = parseInt(num.text()) - 1;
                $(checkButtons.eq(i)[0].children[1]).text(newNum);
            }
        }

        //console.log(`alterValues = ${alterValues}`);

        //$('#outCheckButtonIndex').each(function () {
        //    console.log(parseInt($(this).text()));
        //    if (alterValues.indexOf(parseInt($(this).text())) !== -1) {
        //        $(this).text(parseInt($(this).text) - 1);
        //    }
        //});
    }

    $(document).on('click', function (e) {
        const className = $(e.target).attr('class');
        if (className === 'inCheck px-5') {
            handleSelectDiplay(e);
        }
    });

    const handleSelectDiplay = (e) => {
        const checkBox = e.target;
        if (displayConfigSelect) {
            console.log($(checkBox));
            if ($(checkBox)[0].checked) {
                //$(checkBox).parent().parent().parent().find('.outSelectionIndex').text(selected.length);
                $(checkBox).parent().removeClass('btn-secondary').addClass('btn-success');
                selected.push($(checkBox).val());
                //console.log($(checkBox).val());
                $(checkBox).parent().find('#outCheckButtonIndex').text(`${selected.length})`);

                const name = $(checkBox).parent().find('#name').text();

                $('#confirmation').append(
                    `<div class="col-12"> 
                        <label class="btn btn-secondary mx-3 my-3 check-button">
                        <input class="inCheck px-5" type="checkbox" style="display: none;"><span id="outCheckButtonIndex"></span>${name}</label>
                    </div>`
                );
            } else {
                console.log(selected.length);
                console.log(selected.indexOf($(checkBox).val()));

                if (selected.length - selected.indexOf($(checkBox).val()) > 1) {
                    //renumber
                    renumberOutCheckButtonIndex(selected.indexOf($(checkBox).val()));
                }

                $(checkBox).parent().find('#outCheckButtonIndex').text('');
                $(checkBox).parent().removeClass('btn-success').addClass('btn-secondary');
                selected = selected.filter(s => s !== $(checkBox).val());
            }

            //console.log(selected);
            localStorage.setItem('selectedItems', JSON.stringify(selected));
            console.log(selected.length);

            $(checkBox).parent().parent().parent().parent().parent().parent().find('#outNumSelected').text(`${selected.length}`);

            checkEnableSubmit();

            console.log(JSON.parse(localStorage.getItem('selectedItems')));

        }
    }

    $('#btnSaveSlideshowInterval').on('click', function () {
        const setSlideShowIntervalSeconds = $('#inSlideshowInterval').val() > 1 ? $('#inSlideshowInterval').val() : 1;
        const setSlideShowInterval = setSlideShowIntervalSeconds * 60 * 1000;
        // const setSlideShowInterval = 5000;
        localStorage.setItem('setSlideShowInterval', setSlideShowInterval);
        slideShowInterval = parseInt(setSlideShowInterval);
        console.log(slideShowInterval);
        $('#modalSlideshowTimer').modal('toggle');
    });

    console.log(localStorage.getItem('selectedItems'));

    $('#newDisplay').on('click', function () {
        $('#modalNewDisplay').modal('show');
    });

    // if (s_display_name.length < 1 && s_display_url.length < 1) {
    //     $('#btnSubmitNewDisplay').prop('disabled', true);
    // } else {
    //     $('#btnSubmitNewDisplay').prop('disabled', false);
    // }

    $('#btnSubmitNewDisplay').on('click', function (e) {
        const s_display_name = $('#s_display_name').val();
        const s_display_url = $('#s_display_url').val();

        axios.post(`/api/addDisplay`, {
            data: {
                s_display_name,
                s_display_url,
                s_unit
            }
        }).then((res, err) => {
            displays.push(res.data);
            appendDisplayButton(res.data, !displayConfigSelect);
            $('#modalNewDisplay').modal('hide');
        });

    });

    let selectedDisplay;

    $(document).on('click', function (e) {
        const className = $(e.target).attr('class');
        if (className === 'fas fa-edit') {
            const id = $(e.target).attr('id');
            const display = displays.find(d => d.id == id);
            selectedDisplay = display;

            $('#update_s_display_name').val(display.s_display_name);
            $('#update_s_display_url').val(display.s_display_url);
            $('#modalUpdateDisplay').modal('show');
        }
    });

    $('#btnSubmitUpdateDisplay').on('click', function () {
        const s_display_name = $('#update_s_display_name').val();
        const s_display_url = $('#update_s_display_url').val();

        if (s_display_name.length > 0 && s_display_url.length > 0) {
            axios.put('/api/updateDisplay', {
                data: {
                    s_display_name,
                    s_display_url,
                    id: selectedDisplay.id
                }
            }).then((res, err) => {
                const updatedIndex = displays.findIndex(d => d.id === selectedDisplay.id);
                displays[updatedIndex] = res.data;
                renderDisplayButtons(!displayConfigSelect);
                $('#modalUpdateDisplay').modal('hide');
            });
        }
    });

    $('#btnSubmitDeleteDisplay').on('click', function (e) {
        axios.delete(`/api/deleteDisplay/${selectedDisplay.id}`).then((res, err) => {
            displays = displays.filter(d => d.id !== selectedDisplay.id);
            renderDisplayButtons(!displayConfigSelect);
            $('#modalUpdateDisplay').modal('hide');
        });
    });

    $('#resetDisplay').on('click', function (e) {
        resetDisplayConfig();
        renderDisplayButtons(!displayConfigSelect);
        selected = [];
        localStorage.setItem('selectedItems', JSON.stringify(selected));
        renumberOutCheckButtonIndex(0);
    });


});


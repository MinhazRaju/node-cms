var socket = io();

socket.on('connect', function () {
    console.log('connect to client')
})

socket.on('previousData', liveClickResult)

function liveClickResult(clickCount) {

    $('#likeViews p').remove()
    $('#likeViews').html(`<p style="font-size:50px">${clickCount[0].likesCount}</p>`)

}

$('#d').hide()
$('#like').mouseover(function () {
    $('#d').show(function () {
        $('#like').mouseleave(function () {
            $('#d').hide()
        })
    })

})




$('#like').click(function (event) {



    const postId = event.target.dataset.postId
    const buttonTextAttr = event.target.textContent
    var buttonText = buttonTextAttr.trim().toString()

    if (buttonText === 'Like') {

        $(this).text('Unlike')
        $(this).append(' <i class="thumbs down outline icon"></i>')
        $(this).removeClass('btn-outline-success').addClass('btn-outline-danger')


    } else if (buttonText === 'Unlike') {

        $(this).text('Like')
        $(this).append(' <i class="thumbs up outline icon"></i>')
        $(this).removeClass('btn-outline-danger').addClass('btn-outline-success')
    }

    insertData(postId, buttonText)
    getData(postId)
})


function insertData(postId, buttonText) {
    $.post(`http://localhost:1000/like/${buttonText}/${postId}`);
}

function getData(postId) {
    $.post('http://localhost:1000/likeCounterShow/' + postId)
}
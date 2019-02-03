$(document).ready(function () {

    $("[name='approvePosts']").bootstrapSwitch()
    $("[name='approvePosts']").on('switchChange.bootstrapSwitch', function (event, data) {

        const id = $(this).attr('data-id')
        console.log(id)

        if (this.checked) {
            $(`.${id}`).removeClass('not-active')
            $(`.${id}`).text('View Post')
        } else if (!this.checked) {
            $(`.${id}`).addClass('not-active')
            $(`.${id}`).text('Disabled')

        }


        $.ajax({
            type: 'POST',
            url: '/admin/posts/approve',
            data: {
                id: id,
                approve: data
            },
            cache: false,
            success: function (data) {

                if (data.allowPost == true) {
                    toastr.error(data.title.toUpperCase());


                } else if (data.allowPost == false) {
                    toastr.success(data.title.toUpperCase());
                }
            }
        })
    }) //approve post end







    $("[name='approveComment']").bootstrapSwitch()
    $("[name='approveComment']").on('switchChange.bootstrapSwitch', function (event, data) {

        const id = $(this).attr('data-id')


        $.ajax({

            type: 'POST',
            url: '/admin/comment/approve',
            data: {
                id: id,
                approve: data
            },
            cache: false,
            success: function (data) {

                if (data.approveComment == true) {
                    toastr.error('Disable');


                } else if (data.approveComment == false) {
                    toastr.success('Enable');
                }
            }
        })
    }) //Approve comment end




    $('#allselect').click(function () {

        if (this.checked) {
            $('.singleselect').each(function () {
                this.checked = true
                $('#dd').removeAttr('disabled')

            })
        } else {
            $('.singleselect').each(function () {
                this.checked = false
            })
        }

    }) //Multipale Delete Funcition end 





    
    $('.singleselect').click(function () {

        $('#dd').removeAttr('disabled')
  
      })
  
  
      $('.loader').click(function () {
        $('.active').addClass('dimmer')
      })
  












}) //ajax end
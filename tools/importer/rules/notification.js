export default function createNotificationBlocks(main, document) {
    const notification = main.querySelector('#root_content_xfreference_copy_cop');
  
    // fast return
    if (!notification) {
      return;
    }
  
    //Table cell creation
    const cells = [['aside (notification, small)']];

    //Selecting all images
    const images = notification.querySelectorAll("img");
    const imageWrapper = document.createElement('p');
    for (let i = 0; i < images.length; i++) {
      const img = document.createElement('img');
      img.src = images[i].getAttribute('src');
      imageWrapper.appendChild(img);
    }
    
    //Selecting text
    const notificationText = notification.querySelector(".text p b").textContent;
    let txtCnt = document.createElement('p');
    txtCnt.innerHTML = notificationText; 

    //Selecting Button element
    const linkBtnTXT = notification.querySelector(".cta a .spectrum-Button-label");
    const linkBtnHref = notification.querySelector(".cta a").href;
    //Selecting background image
    const BgImage = "https://cc-prod.scene7.com/is/image/CCProdAuthor/BF_CM_banner_substance?$png$&jpegSize=100&wid=599"
    const bckgrndImage = document.createElement('a');
    bckgrndImage.href = BgImage;
    bckgrndImage.innerHTML = BgImage;
    cells.push([bckgrndImage]);

    const wrapper = document.createElement('div');
    wrapper.appendChild(imageWrapper);
    wrapper.appendChild(txtCnt);

    //for button
    const btnWrapper = document.createElement('a');
    const italicsElement = document.createElement('I');
    italicsElement.appendChild(linkBtnTXT);
    btnWrapper.appendChild(italicsElement);
    btnWrapper.href = linkBtnHref;
    wrapper.appendChild(btnWrapper);

    cells.push([wrapper]);
    
    //Pushing data to table
    const notificationBlockTable = WebImporter.DOMUtils.createTable(
        cells,
        document,
      );
    
    notification.replaceWith(notificationBlockTable);
   
  }
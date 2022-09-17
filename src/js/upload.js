import { deleteElement, downloadElement } from 'src/js/sliderItem.js';

export default function displayElement(file, id) {
  const reader = new FileReader();
  reader.onload = ev => {
    $('.slider').slick(
      'slickAdd',
      `
    <div class="slider__item" id="${id}">
      <div class="item_header">
        <p>${file.name}</p>
        <svg class="icon_delete" width="18px" height="18px" style="opacity:0" >
            <use xlink:href="#delete-icon"></use>
        </svg>
      </div>
    
      <img disabled src="${ev.target.result}" alt="${file.name}" />
      <div class="multi-spinner-container">
        <div class="multi-spinner">
          <div class="multi-spinner">
            <div class="multi-spinner">
              <div class="multi-spinner">
                <div class="multi-spinner">
                  <div class="multi-spinner"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <a href="" id="down_one" style="display:none"></a>
    <button class="button down_one" style="opacity:0">СКАЧАТЬ</button>
  </div>
    `
    );
  };
  reader.readAsDataURL(file);
  setTimeout(() => {
    const deleteIcon = document
      .getElementById(id)
      .querySelector('svg.icon_delete');
    deleteIcon.addEventListener('click', deleteElement);

    const dowmloadItem = document
      .getElementById(id)
      .querySelector('button.button.down_one');
    dowmloadItem.addEventListener('click', downloadElement);
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
    
    displayKanbanLoading();
});

function displayKanbanLoading() {
    const ktGridRoot = document.querySelector('div.kt-grid.kt-grid--hor.kt-grid--root');
    ktGridRoot.style.overflow = 'hidden';

    // Make the loader visible
    var li_loading = document.getElementById('li_loading');
    li_loading.style.display = 'flex';

    let columns = '';
    for (let i = 0; i < 15; i++) {
        let cards = '';
        for (let j = 0; j < 15; j++) {
            cards += `
                <div class="kbl_card">
                    <div class="kbl_tags">
                        <div class="taggy kbl_shimmer" style="width: 28%; height: 14px;"></div>
                        <div class="taggy kbl_shimmer" style="width: 41%; height: 14px;margin-left: 0.5rem;"></div>
                    </div>
                    <div class="kbl_shimmer" style="width: 88%; height: 10px;margin-bottom: 0.3rem;"></div>
                    <div class="kbl_shimmer" style="width: 67%; height: 10px;margin-bottom: 0.3rem;"></div>
                    <div class="kbl_toolbar">
                        <div class="toolbar-left">
                            <div class="kbl_shimmer" style="width: 20%; height: 20px;"></div>
                            <div class="kbl_shimmer" style="width: 20%; height: 20px; margin-left: 0.25rem;"></div>
                        </div>
                        <div class="toolbar-right">
                            <div class="kbl_shimmer" style="width: 20%; height: 20px;"></div>
                            <div class="kbl_shimmer" style="width: 20%; height: 20px; margin-left: 0.25rem;"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        columns += `
            <div class="kbl_column">
                <div class="kbl_header">
                    <div class="kbl_shimmer" style="width: 58%; height: 20px;"></div>
                </div>
                <div class="kbl_body">${cards}</div>
            </div>
        `;
    }

    li_loading.innerHTML = columns;
    //li_loading.style.display = 'none';
}

function hideKanbanLoading() {
    li_loading.style.display = 'none';
    li_loading.innerHTML = '';
}
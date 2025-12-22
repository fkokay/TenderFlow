document.addEventListener("DOMContentLoaded", function () {
    
    displayTableLoading();
});

function displayTableLoading() {

    $("#tableFilteHeader").hide();
    const ktGridRoot = document.querySelector('div.kt-grid.kt-grid--hor.kt-grid--root');
    ktGridRoot.style.overflow = 'hidden';

    // generate random width between
    function getRandomShimmerWidth() {
        return Math.floor(Math.random() * (92 - 22 + 1)) + 12;
    }

    const li_loading = document.getElementById('li_loading');
    li_loading.style.display = 'contents';

    const loadingContent = `
        <div class="kt-portlet__head">
            <div class="list_table_shimmer" style="width: 153px; height: 20px;"></div>
        </div>
        <div class="kt-content px-0 pb-0">
            <table class="table table-semantic-loading">
                <thead>
                    <tr>
                        <th width="28">
                            <div class="list_table_shimmer" style="width: 100%; height: 16px;"></div>
                        </th>
                        <th width="0%">
                            <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                        <th width="20%">
                            <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                        <th width="20%">
                            <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                        <th width="20%">
                            <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                        <th width="20%">
                            <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 16px;"></div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${Array(20).fill().map(() => `
                        <tr>
                            <td width="28">
                                <div class="list_table_shimmer" style="width: 100%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                            <td>
                                <div class="list_table_shimmer" style="width: ${getRandomShimmerWidth()}%; height: 14px;"></div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    li_loading.innerHTML = loadingContent;

}

function hideTableLoading() {
    li_loading.style.display = 'none';
    li_loading.innerHTML = '';
}
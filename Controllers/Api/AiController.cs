using Microsoft.AspNetCore.Mvc;
using TenderFlow.AI.Rag;
using TenderFlow.Models.Api;

namespace TenderFlow.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IRagService _ragService;

        public AiController(IRagService ragService)
        {
            _ragService = ragService;
        }

        public class AskRequest
        {
            public string Question { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<IActionResult> IndexTenders()
        {
            try
            {
                await _ragService.IndexTendersAsync();
                return Ok(new { status = "ok", message = "Tüm ihaleler indexlendi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Ask([FromBody] AskRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Question))
                return BadRequest("Soru boş olamaz.");

            try
            {
                var answer = await _ragService.AskAsync(req.Question);
                return Ok(answer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}

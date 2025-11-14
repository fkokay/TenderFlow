using Microsoft.AspNetCore.Mvc;
using TenderFlow.Services;

namespace TenderFlow.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly RagService _rag;

        public AiController(RagService rag)
        {
            _rag = rag;
        }

        public class AskRequest
        {
            public string Question { get; set; } = string.Empty;
        }

        [HttpPost("index-tenders")]
        public async Task<IActionResult> IndexTenders()
        {
            await _rag.IndexTendersAsync();
            return Ok(new { status = "ok" });
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] AskRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Question))
                return BadRequest("Soru boş olamaz.");

            var answer = await _rag.AskAsync(req.Question);
            return Ok(new { answer });
        }
    }
}

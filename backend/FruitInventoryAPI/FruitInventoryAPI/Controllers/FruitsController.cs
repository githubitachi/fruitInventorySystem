using Microsoft.AspNetCore.Mvc;
using FruitInventoryAPI.Data;
using FruitInventoryAPI.Models;

namespace FruitInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FruitsController : ControllerBase
    {
        private readonly FruitRepository _repository;

        public FruitsController(FruitRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Fruit>>> GetFruits()
        {
            try
            {
                var fruits = await _repository.GetAllFruitsAsync();
                return Ok(fruits);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddFruit([FromBody] FruitRequest request)
        {
            try
            {
                await _repository.AddFruitAsync(request);
                return Ok(new { message = "Fruit added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFruit(int id, [FromBody] FruitRequest request)
        {
            try
            {
                await _repository.UpdateFruitAsync(id, request);
                return Ok(new { message = "Fruit updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
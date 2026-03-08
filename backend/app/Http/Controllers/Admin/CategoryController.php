<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/admin/categories
    public function index()
    {
        $categories = Category::withCount('jobs')->get();
        return response()->json($categories);
    }

    // POST /api/admin/categories
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|unique:categories',
            'emoji' => 'nullable|string',
        ]);
        $category = Category::create($data);
        return response()->json($category, 201);
    }

    // PUT /api/admin/categories/{id}
    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'  => 'required|string|unique:categories,name,' . $category->id,
            'emoji' => 'nullable|string',
        ]);
        $category->update($data);
        return response()->json($category);
    }

    // DELETE /api/admin/categories/{id}
    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Category deleted.']);
    }
}
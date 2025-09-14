import { _axios } from "interceptors/http-config";
import { Category, IndexObj, RootObj, StudentCategoriesResponse } from "interface/common";

class CategoriesService {
  private static _instance: CategoriesService;
  //   private readonly URL = "admin";

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getCategories(): Promise<RootObj<Category[]>> {
    return _axios.get<any>(`student/categories`).then((res) => res.data);
  }

  // New method for student categories API with pagination support
  getStudentCategories(page: number = 1, per_page: number = 15): Promise<StudentCategoriesResponse> {
    return _axios.get<StudentCategoriesResponse>(`student/categories`, {
      params: { page, per_page }
    }).then((res) => res.data);
  }

  // Public method to fetch categories without authentication
  getPublicStudentCategories(page: number = 1, per_page: number = 15): Promise<StudentCategoriesResponse> {
    return _axios.get<StudentCategoriesResponse>(`student/categories`, {
      params: { page, per_page },
      headers: {
        // Explicitly remove authorization header for public access
        Authorization: undefined
      }
    }).then((res) => res.data).catch((error) => {
      // For public access, don't redirect on 401, just return empty data
      if (error.response?.status === 401) {
        console.log('Public categories access - no authentication required');
      }
      return {
        status: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch categories',
        data: {
          content: [],
          pagination: {
            current_page: 1,
            from: 0,
            last_page: 1,
            per_page: 15,
            to: 0,
            total: 0,
            count: 0,
            has_next: false,
            next_page_url: null,
            previous_page_url: null,
            pagination_name: 'page'
          }
        }
      };
    });
  }

  // Method to fetch all student categories across all pages
  async getAllStudentCategories(): Promise<StudentCategoriesResponse> {
    try {
      let allCategories: any[] = [];
      let currentPage = 1;
      let hasMore = true;
      let totalCount = 0;
      let lastResponseData: any = null;

      while (hasMore) {
        const response = await this.getStudentCategories(currentPage, 50); // Use larger page size for efficiency
        
        if (response.status && response.data?.content) {
          allCategories = [...allCategories, ...response.data.content];
          totalCount = response.data.pagination.total;
          hasMore = response.data.pagination.has_next;
          currentPage++;
          lastResponseData = response.data;
        } else {
          hasMore = false;
        }
      }

      // Return in the same format as the original API
      return {
        status: true,
        message: "Success",
        data: {
          content: allCategories,
          pagination: {
            current_page: 1,
            from: 1,
            last_page: Math.ceil(totalCount / allCategories.length) || 1,
            per_page: allCategories.length,
            to: allCategories.length,
            total: totalCount,
            count: allCategories.length,
            has_next: false,
            next_page_url: null,
            previous_page_url: null,
            pagination_name: "page"
          }
        }
      };
    } catch (error) {
      console.error("Error fetching all student categories:", error);
      return {
        status: false,
        message: "Failed to fetch categories",
        data: {
          content: [],
          pagination: {
            current_page: 1,
            from: 0,
            last_page: 1,
            per_page: 0,
            to: 0,
            total: 0,
            count: 0,
            has_next: false,
            next_page_url: null,
            previous_page_url: null,
            pagination_name: "page"
          }
        }
      };
    }
  }
}

export const _CategoriesService = CategoriesService.Instance;

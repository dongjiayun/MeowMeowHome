// 使本文件成为环境声明
import ''

declare global {
   type PromiseValueType<T extends Promise<any>> = T extends Promise<infer P> ? P : never
}

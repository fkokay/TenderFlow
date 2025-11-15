using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.AI.Embedding
{
    public static class EmbeddingNormalizer
    {
        private const int TargetDim = 1536;

        public static float[] Normalize(float[] v)
        {
            if (v == null || v.Length == 0)
                throw new Exception("Embedding boş!");

            // Model boyutu ne üretiyorsa onu kullan
            return v;
        }
    }
}

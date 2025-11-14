using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TenderFlow.Core.Utils
{
    public static class DateUtils
    {
        public static int GetMonthDifference(DateTime start, DateTime end)
        {
            return ((end.Year - start.Year) * 12) + end.Month - start.Month;
        }
    }
}

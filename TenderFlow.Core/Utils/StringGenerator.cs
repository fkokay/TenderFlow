using System;
using System.Collections.Generic;
using System.Text;

namespace TenderFlow.Core.Utils
{
    public class StringGenerator
    {
        private readonly List<string> _lines = new();
        private readonly StringBuilder _sb = new();

        public void AppendLine(string value)
        {
            if (string.IsNullOrEmpty(value)) return;

            if (_sb.Length > 0)
                _sb.AppendLine();

            _sb.Append(value);
            _lines.Add(value);
        }

        public void Append(string value)
        {
            if (!string.IsNullOrEmpty(value))
                _sb.Append(value);
        }

        public string GetLastLine()
            => _lines.Count > 0 ? _lines[^1] : "";

        public bool IsEmpty => _sb.Length == 0;

        public void Clear()
        {
            _sb.Clear();
            _lines.Clear();
        }

        public override string ToString()
            => _sb.ToString();
    }

}
